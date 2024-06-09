import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { ApplyProjectDialogComponent } from '../apply-project-dialog/apply-project-dialog.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PartnerDTO } from '../../interfaces/partner.model';
import { PhaseDTO } from '../../interfaces/phase.model';
import { TaskDTO } from '../../interfaces/task.model';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-init-phase',
  templateUrl: './init-phase.component.html',
  styleUrls: ['./init-phase.component.scss']
})
export class InitPhaseComponent {
  token: string;
  task!: TaskDTO;
  taskForm!: FormGroup;
  phase!: PhaseDTO;
  currentConnectedUser?: any;
  teamMembers: Array<PartnerDTO> = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    console.log(this.dialogData.phase);
    this.phase = this.dialogData.phase;
    this.task = this.dialogData.task;
    this.task.phase = {id: this.phase.id};
    this.teamMembers = this.dialogData.teamMembers;

    this.taskForm = this.fb.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      affectedPart: new FormControl(null, [Validators.required]),
      done1: new FormControl(true, [Validators.required]),
      done2: new FormControl(false, [Validators.required]),
    });

    this.taskForm.setValue ({
      startDate: this.task.startDate,
      endDate: this.task.endDate,
      affectedPart: this.teamMembers.map(member => member.id).indexOf(this.phase.assignee?.id!),
      done1: this.task.done ? true : false,
      done2: this.task.done ? false : true,
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

  handleChange(fieldName: string) {
    const otherField = fieldName === 'done1' ? 'done2' : 'done1';
    if (this.taskForm.get(fieldName)?.value) {
      this.taskForm.get(otherField)?.setValue(false);
    }
  }

  getControl(controlName: string) {
    return this.taskForm.get(controlName);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitAffectation() {
    const formValue = this.taskForm.value;
    this.task.startDate = formValue.startDate;
    this.task.endDate = formValue.endDate;
    this.task.assignee = this.teamMembers[parseInt(formValue.affectedPart)];
    this.task.done = formValue.done1;
    console.log(this.taskForm);
    console.log(this.task);


    this.projectService.updateTask(this.token, this.task).subscribe({
      next: (data) => {
        console.log(data);
        this.task = data;
        console.log("*********************************");
        console.log(this.phase);

        // this.phase.progression = this.phase.tasks?.filter(t => t.done).length;

        // this.projectService.updatePhase(this.token, this.phase).subscribe({
        //   next: (data) => {
        //     console.log("-------------------------------");

        //     console.log(this.phase);

        //   }
        // });

        this.toastr.success("La tache a bien été mise à jour", "Succés Update", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
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

  isPhaseNotAssignedToUser() {
    return this.currentConnectedUser.id !== this.phase.assignee?.id;
  }

  isTaskNotAssignedToUser() {
    return this.currentConnectedUser.id !== this.task.assignee?.id;
  }
}
