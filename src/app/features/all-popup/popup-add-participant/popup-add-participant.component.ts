import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../interfaces/project.model';
import { ProjectService } from '../../services/project/project.service';
import {debounceTime, map, Observable, of, startWith, switchMap} from "rxjs";
import {UserService} from "../../services/user/user.service";
import {UserDTO} from "../../interfaces/user-dto.model";

@Component({
  selector: 'app-popup-add-participant',
  templateUrl: './popup-add-participant.component.html',
  styleUrls: ['./popup-add-participant.component.scss']
})
export class PopupAddParticipantComponent implements OnInit {
  @Output() participantAdded = new EventEmitter<any>();
  token: string;
  project: Project;
  addParticipantForm: FormGroup;
  data: UserDTO[] = [];
  options: UserDTO[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<UserDTO[]> = of();

  displayFn(user: UserDTO): string {
    return user && user.email ? user.email : '';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<PopupAddParticipantComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private userService: UserService
    ) {
      this.token = this.dialogData.token;
      this.project = this.dialogData.project;
      this.addParticipantForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]]
      })
  }
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => this.userService.searchUsers(value, this.token)),
      map(response => response)
    );
  }

  selectUser(email: string): void {
    const emailControl = this.addParticipantForm.get('email');
    if (emailControl) {
      emailControl.setValue(email);
    }
  }

  getControl(controlName: string) {
    return this.addParticipantForm.get(controlName);
  }

  submit() {
    const email = this.addParticipantForm.get('email')?.value;
    console.log(email);

    this.projectService.addParticipant(this.dialogData.token, this.dialogData?.project?.id, email).subscribe({
      next: (data) => {
        console.log(data);
        this.toastr.success("success", "L'utilisateur a été ajouté avec succès au projet", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
       this.participantAdded.emit(data);
       this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur l'ajout de l'utilisateur au projet", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      }
    })
  }

}
