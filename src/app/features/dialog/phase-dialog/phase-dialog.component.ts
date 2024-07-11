import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { ApplyProjectDialogComponent } from '../apply-project-dialog/apply-project-dialog.component';
import { PhaseDTO } from '../../interfaces/phase.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartnerDTO } from '../../interfaces/partner.model';
import { Project } from '../../interfaces/project.model';
import { UserService } from '../../services/user/user.service';
import { forkJoin } from 'rxjs';
import { StopProjectDialogComponent } from '../stop-project-dialog/stop-project-dialog.component';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-pre-sales',
  templateUrl: './phase-dialog.component.html',
  styleUrls: ['./phase-dialog.component.scss']
})
export class PhaseDialogComponent implements OnInit {
  token: string;
  phase!: PhaseDTO;
  phaseForm!: FormGroup;
  teamMembers: Array<PartnerDTO> = [];
  project!: Project;
  currentConnectedUser?: any;
  @Output() projectModified = new EventEmitter<any>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private translateService: TranslateService
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    this.project = this.dialogData.project;
    this.phase = this.dialogData.phase;
    this.phase.project ={ id: this.project.id, createdAt: this.project.createdAt};
    this.teamMembers = this.dialogData.teamMembers;

    this.phaseForm = this.fb.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      affectedPart: new FormControl(null, [Validators.required]),
    });

    this.phaseForm.setValue ({
      startDate: this.phase.startDate,
      endDate: this.phase.endDate,
      affectedPart: this.teamMembers.map(member => member.id).indexOf(this.phase.assignee?.id!),
    });
  }

  getControl(controlName: string) {
    return this.phaseForm.get(controlName);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openStopProjectDialog() {
    const project = this.project;
    this.dialog.open(StopProjectDialogComponent, {
      hasBackdrop: true,
      data: {
        project
      },
      panelClass: 'custom-dialog-container'
    })
  }

  onFullyValidateProject() {
    this.phase.fullyValidated = true;
    console.log(this.phase);

    this.projectService.updatePhase(this.token, this.phase).subscribe({
      next: (data) => {
        this.phase = data;

        const taskUpdateObservables = this.phase.tasks?.map(task => {
          task.done = true;
          task.phase = { id: this.phase.id };
          return this.projectService.updateTask(this.token, task);
        }) || [];

        forkJoin(taskUpdateObservables).subscribe({
          next: (results) => {
            results.forEach((updatedTask, index) => {
              this.phase.tasks![index] = updatedTask;
            });

            this.translateService.get(['SUCCESS_UPDATE_PHASE', 'SUCCESS_TITLE']).subscribe(translations => {
              this.toastr.success(translations['SUCCESS_UPDATE_PHASE'], translations['SUCCESS_TITLE'], {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              });
            });

            this.projectModified.emit(this.phase);
            this.closeDialog();
          },
          error: (err) => {
            console.log(err);
            this.translateService.get(['ERROR_UPDATE_TASKS', 'ERROR_TITLE']).subscribe(translations => {
              this.toastr.error(translations['ERROR_UPDATE_TASKS'], translations['ERROR_TITLE'], {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              });
            });
          }
        });
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_UPDATE_PHASE', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_UPDATE_PHASE'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

  onStopProject() {
    this.openStopProjectDialog();
  }

  submitAffectation() {
    const formValue = this.phaseForm.value;
    this.phase.startDate = formValue.startDate;
    this.phase.endDate = formValue.endDate;
    this.phase.assignee = this.teamMembers[parseInt(formValue.affectedPart)];
    console.log(this.phaseForm);
    console.log(this.phase);

    this.projectService.updatePhase(this.token, this.phase).subscribe({
      next: (data) => {
        this.phase = data;

        this.translateService.get(['SUCCESS_UPDATE_PHASE', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_UPDATE_PHASE'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });

       this.projectModified.emit(this.phase);
       this.closeDialog();
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_UPDATE_PHASE', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_UPDATE_PHASE'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
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

  isPhaseNotAssignedToUser() {
    return this.currentConnectedUser.id !== this.phase.assignee?.id;
  }

  isNotApplicant() {
    return this.currentConnectedUser.id !== this.project.applicant?.id;
  }


}
