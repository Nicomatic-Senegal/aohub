import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-pre-sales',
  templateUrl: './phase-dialog.component.html',
  styleUrls: ['./phase-dialog.component.scss']
})
export class PhaseDialogComponent {
  token: string;
  phase!: PhaseDTO;
  phaseForm!: FormGroup;
  teamMembers: Array<PartnerDTO> = [];
  project!: Project;
  currentConnectedUser?: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
      this.loadCurrentConnectedUser();
    console.log(this.dialogData.project);
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
        console.log(data);

        this.phase = data;

        const taskUpdateObservables = this.phase.tasks?.map(task => {
          task.done = true;
          task.phase = { id: this.phase.id };
          return this.projectService.updateTask(this.token, task);
        }) || [];

        forkJoin(taskUpdateObservables).subscribe({
          next: (results) => {
            console.log(results);

            results.forEach((updatedTask, index) => {
              this.phase.tasks![index] = updatedTask;
            });

            this.toastr.success("La phase a bien été mise à jour", "Succés Update", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });

            this.closeDialog();
            this.refreshPage();
          },
          error: (err) => {
            console.log(err);
            this.toastr.error(err.error.detail, "Erreur sur la mise jour des tâches", {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
          }
        });
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la mise jour de la phase", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
      }
    });
  }

  refreshPage() {
    window.location.reload();
    // this.router.navigate(['/project-options'], { queryParams: { id: this.project.id } });
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
        console.log(data);
        this.phase = data;

        this.toastr.success("La phase a bien été mise à jour", "Succés Update", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });

       this.closeDialog();
       this.refreshPage();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la mise jour de la phase", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
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
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
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
