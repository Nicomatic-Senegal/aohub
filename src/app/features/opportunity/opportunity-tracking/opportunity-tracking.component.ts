import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../interfaces/project.model';
import { PositioningDTO, PositioningStatus } from '../../interfaces/positioning-dto.model';
import { Disponibility } from '../../interfaces/disponibility.model';
import { digitOnly } from '../../interfaces/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-opportunity-tracking',
  templateUrl: './opportunity-tracking.component.html',
  styleUrls: ['./opportunity-tracking.component.scss']
})
export class OpportunityTrackingComponent implements OnInit {
  token!: string;
  listProject: Project[] = [];
  listPositionners: Map<string, PositioningDTO[]> = new Map<string, PositioningDTO[]>();
  positioners: Array<Array<PositioningDTO>> = [];
  totalItems = 4;
  itemPerPage = 2;
  currentPage = 1;

  myForm: FormGroup;


  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
      this.myForm = this.fb.group({
        nbDays: [1, [Validators.required, Validators.min(1), Validators.max(30)]]
      });

  }

  ngOnInit(): void {
    this.loadProject();
  }

  extendDeadlineForOpportunity(id: number, deadlinePositioningStr: Date, createdAtStr: Date): void {
    if (this.myForm.valid) {
      const nbDays = this.myForm.get('nbDays')?.value;
      const nbDaysInMilliseconds = nbDays * 24 * 60 * 60 * 1000;

      const createdAt = new Date(createdAtStr).getTime();

      const deadlinePositioning = new Date(deadlinePositioningStr).getTime();

      const differenceInMilliseconds = deadlinePositioning - createdAt;

      const newDeadlinePositioningInMilliseconds = createdAt + differenceInMilliseconds + nbDaysInMilliseconds;


      if (newDeadlinePositioningInMilliseconds - createdAt < 30 * 24 * 60 * 60 * 1000) {
        const deadlinePositioning = new Date(newDeadlinePositioningInMilliseconds);

        const payload = {
          id: id,
          deadlinePositioning: deadlinePositioning
        };

        this.projectService.extendDeadlineForOpportunity(this.token, payload, id).subscribe({
          next: (data) => {
            this.translateService.get(['SUCCESS_EXTEND_PROJECT_DURATION', 'SUCCESS_TITLE'], { nbDays }).subscribe(translations => {
              this.toastr.success(translations['SUCCESS_EXTEND_PROJECT_DURATION'], translations['SUCCESS_TITLE'], {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              });
            });
          },
          error: (error) => {
            console.log(error);
          }
        });
      } else {
        this.translateService.get(['ERROR_ALREADY_ADD_MORE_THAN_30_DAYS_TO_PROJECT_DURATION', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_ALREADY_ADD_MORE_THAN_30_DAYS_TO_PROJECT_DURATION'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }

    } else {
      this.translateService.get(['ERROR_CANNOT_ADD_MORE_THAN_30_DAYS_TO_PROJECT_DURATION', 'ERROR_TITLE']).subscribe(translations => {
        this.toastr.error(translations['ERROR_CANNOT_ADD_MORE_THAN_30_DAYS_TO_PROJECT_DURATION'], translations['ERROR_TITLE'], {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      });
    }
  }

  loadProject() {
    this.projectService.getAllMyProjects(this.token).subscribe({
      next: (data) => {
        this.listProject = data;

        this.listProject.forEach(project => {
          this.projectService.getPartnersInMyProjects(this.token, project.id).subscribe({
            next: (data1) => {
                this.positioners[project.id] = data1;
            },
            error: (err) => {
                console.error(err);
            }
          });
        });

        this.totalItems = this.listProject.length
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

  getAllDisponibility(dispo: Disponibility[]) {
    if (dispo)
      return dispo.map(d => d.instant);
    return null;
  }

  validatePositioning(idProject: number, indice: number, idPos: number) {
    this.projectService.validatePositioning(this.token, idPos).subscribe({
      next: (data) => {
        this.positioners[idProject][indice].status = PositioningStatus.ACCEPTED;
        this.loadProject();
      },
      error: (err) => {
        console.log(err)
        this.translateService.get(['ERROR_VALIDATE_PARTNER', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_VALIDATE_PARTNER'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      },
      complete: () => {
        this.translateService.get(['SUCCESS_VALIDATE_PARTNER', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_VALIDATE_PARTNER'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

  rejectPositioning(idProject: number, indice: number, idPos: number) {
    this.projectService.rejectPositioning(this.token, idPos).subscribe({
      next: (data) => {
        this.positioners[idProject][indice].status = PositioningStatus.REJECTED;
        this.loadProject();
      },
      error: (err) => {
        this.translateService.get(['ERROR_REJECT_PARTNER', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_REJECT_PARTNER'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      },
      complete: () => {
        this.translateService.get(['SUCCESS_REJECT_PARTNER', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_REJECT_PARTNER'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    digitOnly(event);
  }

  status(value?: PositioningStatus, ) {
      switch(value?.toString()) {
        case "ACCEPTED": return 1;
        case "REJECTED": return 2;
        default: return 3;
      }
  }

  get paginatedProjects() {
    const start = (this.currentPage - 1) * (this.itemPerPage);
    const end = start + this.itemPerPage;

    return this.listProject.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
