import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Project } from '../../interfaces/project.model';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShowMoreDialogComponent } from '../../dialog/show-more-dialog/show-more-dialog.component';
import { ApplyProjectDialogComponent } from '../../dialog/apply-project-dialog/apply-project-dialog.component';
import { UserService } from '../../services/user/user.service';
import { PartnerDTO } from '../../interfaces/partner.model';
        import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent implements OnInit {
  token!: string;
  listProject: Project[] = [];
  totalItems = 0;
  itemPerPage = 2;
  currentPage = 1;
  currentConnectedUser?: PartnerDTO;
  mapDays: Map<number, any> = new Map<number, any>();
  mapAlreadyAppliedApplicant: Map<number, boolean> = new Map<number, boolean>();
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  domainTranslationMap: Record<string, string> = {
    "Décolletage" : "BAR_TURNING",
    "Plasturgie": "PLASTICS_TRANSFORMATION",
    "Traitement de surface": "SURFACE_TREATMENT",
    "Assemblage": "ASSEMBLY",
    "Usinage": "MACHINING",
    "Produit standard": "STANDARD_PRODUCT",
    "Découpe": "CUTTING_STAMPING",
    "Électronique": "ELECTRONICS",
    "Découpe laser": "LASER_CUTTING"
  };
  marketTranslationMap: Record<string, string> = {
    "Automobile": "AUTOMOBILE",
    "Aéronautique": "AERONAUTICS",
    "Énergie": "ENERGY",
    "Électronique": "ELECTRONICS",
    "Spatial": "SPACE",
    "R&D": "R_AND_D",
    "Ingénierie": "ENGINEERING",
    "Médical": "MEDICAL",
    "Aérospatial": "AEROSPACE",
    "Militaire": "MILITARY",
    "Industriel": "INDUSTRIAL",
    "Mobilité urbaine": "URBAN_MOBILITY",
    "Autre": "OTHER"
  };

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog,
    private translateService: TranslateService
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
      const id = userService.getUser(this.token);
    }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    this.loadAllProjects(this.currentPage - 1, this.itemPerPage);
  }

  loadCurrentConnectedUser() {
    const userData = localStorage.getItem("currentConnectedUser");
    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);
    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.currentConnectedUser = data;
        },
        error: (err) => {
          console.log(err);
          this.translateService.get(['ERROR_RECEIVE_USER', 'ERROR_TITLE']).subscribe(translations => {
            this.toastr.error(translations['ERROR_RECEIVE_USER'], translations['ERROR_TITLE'], {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          });
        }
      })
    }
  }

  loadAllProjects(page: number, size: number) {
    this.listProject.splice(0, this.listProject.length);

    this.projectService.getAllProjects(this.token, page, size).subscribe({
      next: (data) => {
        data.projects.forEach(async (project: Project) => {
          const currentDate = new Date();
          const deadlinePositioning = new Date(project.deadlinePositioning!);

          const differenceInMilliseconds = deadlinePositioning.getTime() - currentDate.getTime();
          const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

          const createdAt = new Date(project.createdAt);

          const differenceTotalInMilliseconds = deadlinePositioning.getTime() - createdAt.getTime();
          const differenceTotalInDays = Math.floor(differenceTotalInMilliseconds / (1000 * 60 * 60 * 24));

          if (differenceInMilliseconds) {
            this.mapDays.set(project.id, differenceInDays.toString());
            this.mapDays.set(project.id, { differenceInDays, differenceTotalInDays });

            this.listProject.push(project);
          }

          const isMember = await this.isTeamMember(project, this.currentConnectedUser);
          this.mapAlreadyAppliedApplicant.set(project.id, isMember);

        });
        this.totalItems = data.totalCount;

      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_FETCHING_PROJECTS', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_PROJECTS'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }


  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap((event:KeyboardEvent) => {
            this.performSearch(this.searchInput.nativeElement.value);
          })
      )
      .subscribe();
  }

  performSearch(query: string) {
    if (query) {
      this.projectService.searchProject(this.token, query).subscribe({
        next: (data) => {
          this.listProject = [];
          this.listProject.push(data);
          this.listProject = this.listProject.flatMap(data => data);
          this.totalItems = this.listProject.length;
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.loadAllProjects(0, 2);
    }
  }

  openShowMoreDialog(title: string, description: string) {
    this.dialog.open(ShowMoreDialogComponent, {
      hasBackdrop: true,
      data: {
        title, description
      },
      panelClass: 'custom-dialog-container'
    });
  }

  openApplyToProjectDialog(project: Project) {
    const dialogRef = this.dialog.open(ApplyProjectDialogComponent, {
      hasBackdrop: true,
      data: {
        project
      },
      panelClass: 'custom-dialog-container'
    })

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadAllProjects(this.currentPage - 1, this.itemPerPage);
  }

  formatProjectCount(count: number): string {
    return count.toString().padStart(2, '0');
  }

  calculateProgressWidth(projectId: number): number {
    const differenceDaysValues = this.mapDays.get(projectId) || '0';

    let days = parseInt(differenceDaysValues.differenceInDays);
    days = Math.max(0, days);
    const progressWidth = (days / differenceDaysValues.differenceTotalInDays) * 100;
    return progressWidth;
  }

  getTranslatedNeedType(needType: string): string {
    switch (needType?.toUpperCase()) {
        case 'CONTRACT':
            return 'Contractuel';
        case 'PUNCTUAL':
            return 'Ponctuel';
        default:
            return needType;
    }
  }

  async isTeamMember(project: Project, partner?: PartnerDTO): Promise<boolean> {
    try {
      const data = await this.projectService.isTeamMember(this.token, project.id).toPromise();
      if (data) {
        for (const positioning of data) {
          if (positioning.partner.id === partner?.id) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  translateDomain(domain: string) {
    return this.domainTranslationMap[domain] || domain;
  }

  translateMarket(market: string | undefined): string {
    if (!market) {
      return '';
    }
    return this.marketTranslationMap[market] || market;
  }

}
