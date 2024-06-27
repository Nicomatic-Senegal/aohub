import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
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
import { Project } from '../../interfaces/project.model';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-init-phase',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {
  token: string;
  task!: TaskDTO;
  taskForm!: FormGroup;
  phase!: PhaseDTO;
  project!: Project;
  currentConnectedUser?: any;
  teamMembers: Array<PartnerDTO> = [];
  @Output() projectModified = new EventEmitter<any>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private translateService: TranslateService
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    this.phase = this.dialogData.phase;
    this.task = this.dialogData.task;
    this.project = this.dialogData.project;
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
      affectedPart: this.teamMembers.map(member => member.id).indexOf(this.task.assignee?.id!),
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

  submitTaskChange() {
    const formValue = this.taskForm.value;
    this.task.startDate = formValue.startDate;
    this.task.endDate = formValue.endDate;
    this.task.assignee = this.teamMembers[parseInt(formValue.affectedPart)];
    this.task.done = formValue.done1;

    this.projectService.updateTask(this.token, this.task).subscribe({
      next: (data) => {
        this.task = data;
        this.closeDialog();
        this.phase.progression = this.phase.tasks?.filter(t => t.done).length;
        if (this.phase.progression === this.phase.tasks?.length)
          this.phase.fullyValidated = true;

        this.projectService.updatePhase(this.token, this.phase).subscribe({
          next: (data) => {
            this.phase = data;
          }
        });

        this.translateService.get(['SUCCESS_UPDATE_TASK', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_UPDATE_TASK'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });

       this.projectModified.emit();
       this.dialogRef.close();
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

  isPhaseNotAssignedToUser() {
    return this.currentConnectedUser.id !== this.phase.assignee?.id;
  }

  isTaskNotAssignedToUser() {
    return this.currentConnectedUser.id !== this.task.assignee?.id;
  }
}
