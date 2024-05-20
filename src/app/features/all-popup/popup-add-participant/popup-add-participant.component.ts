import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../interfaces/project.model';
import { ProjectService } from '../../services/project/project.service';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<PopupAddParticipantComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private projectService: ProjectService
    ) {
      this.token = this.dialogData.token;
      this.project = this.dialogData.project;
      this.addParticipantForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]]
      })
  }
  ngOnInit() {

  }

  getControl(controlName: string) {
    return this.addParticipantForm.get(controlName);
  }

  submit() {
    console.log(this.addParticipantForm.value);
    this.projectService.addParticipant(this.dialogData.token, this.dialogData.project, this.dialogData.project.id).subscribe({
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
