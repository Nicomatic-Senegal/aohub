import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Project } from '../interfaces/project.model';
import { PartnerService } from '../services/partner/partner.service';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShowMoreDialogComponent } from '../show-more-dialog/show-more-dialog.component';
import { ApplyProjectDialogComponent } from '../apply-project-dialog/apply-project-dialog.component';
import { UserService } from '../services/user/user.service';
import { PartnerDTO } from '../interfaces/partner.model';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent {
  token!: string;
  listProject: Project[] = [];
  searchData: Project[] = [];
  totalItems = 0;
  itemPerPage = 2;
  currentPage = 1;
  currentConnectedUser!: PartnerDTO;
  positionApplied: boolean = false;
  // startIndex = 1;
  // endIndex = 4;
  mapDays: Map<number, any> = new Map<number, any>();
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private projectService: ProjectService,
    private partnerService: PartnerService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
      const id = userService.getUser(this.token);
    }

  ngOnInit(): void {
    this.loadAllProjects();
    this.userService.getUser(this.token).subscribe({
      next: (data) => {
        this.currentConnectedUser = data;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
          timeOut: 3000,
          positionClass: 'toast-right-center',
       });
      }
    })

  }

  loadAllProjects() {
    this.projectService.getAllProjects(this.token).subscribe({
      next: (data) => {
        console.log(data);

        data.forEach((project: Project) => {
          const currentDate = new Date();
          const deadlinePositioning = new Date(project.deadlinePositioning!);

          const differenceInMilliseconds = deadlinePositioning.getTime() - currentDate.getTime();
          const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

          const createdAt = new Date(project.createdAt);

          const differenceTotalInMilliseconds = deadlinePositioning.getTime() - createdAt.getTime();
          const differenceTotalInDays = Math.floor(differenceTotalInMilliseconds / (1000 * 60 * 60 * 24));

          if (differenceInMilliseconds) {
            this.mapDays.set(project.id, differenceInDays.toString());
            this.mapDays.set(project.id, { differenceInDays, differenceTotalInDays });
            this.listProject.push(project);
          }
        });

        this.totalItems = this.listProject.length;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
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
      this.loadAllProjects();
    }
  }

  onApply(id: number) {
    this.router.navigate(['apply-project'], { queryParams: { id: id } });
  }

  navigate(link: string) {
    this.router.navigate(['apply-project']);
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
      // TODO: ckeck if user have already apply to project
      // this.positionApplied = result.positionApplied;
    });
  }

  get paginatedProjects() {
    const start = (this.currentPage - 1) * (this.itemPerPage);
    const end = start + this.itemPerPage;

    return this.listProject.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
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

  calculateDuration(latestDeadline: Date | undefined): string | undefined {
    if (!latestDeadline) {
      return undefined;
    }

    const latestDeadlineDate = new Date(latestDeadline);
    const today = new Date();
    const timeDiff = Math.abs(today.getTime() - latestDeadlineDate.getTime());

    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = oneDay * 30;
    const oneYear = oneDay * 365;

    let duration: number | undefined;
    let durationText: string | undefined;

    if (timeDiff >= oneYear) {
      duration = Math.ceil(timeDiff / oneYear);
      durationText = duration === 1 ? 'année' : 'années';
    } else if (timeDiff >= oneMonth) {
      duration = Math.ceil(timeDiff / oneMonth);
      durationText = duration === 1 ? 'mois' : 'mois';
    } else {
      duration = Math.ceil(timeDiff / oneDay);
      durationText = duration === 1 ? 'jour' : 'jours';
    }

    return duration !== undefined ? `${duration} ${durationText}` : undefined;
  }

}
