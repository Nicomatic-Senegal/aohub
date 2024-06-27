import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../interfaces/project.model';
import { ProjectService } from '../../services/project/project.service';
import {debounceTime, map, Observable, of, startWith, switchMap} from "rxjs";
import {UserService} from "../../services/user/user.service";
import {UserDTO} from "../../interfaces/user-dto.model";
import {TranslateService} from "@ngx-translate/core";

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
  myControl = new FormControl();
  email = new FormControl();
  filteredOptions: Observable<String[]> = of();
  allOptions: string[] = [];

  displayFn(user: UserDTO): string {
    return user && user.email ? user.email : '';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<PopupAddParticipantComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private userService: UserService,
    private translateService: TranslateService
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
      switchMap(value => this.userService.searchUsers(value, this.token).pipe(
        map(response => {
          this.allOptions = response.map(user => user.email);
          return this.filterOptions(value);
        })
      ))
    );
  }

  private filterOptions(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allOptions.filter(option => option.toLowerCase().includes(filterValue));
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
        this.translateService.get(['SUCCESS_ADD_USER_TO_PROJECT', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_ADD_USER_TO_PROJECT'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
       this.participantAdded.emit(data);
       this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_ADD_USER_TO_PROJECT', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_ADD_USER_TO_PROJECT'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

}
