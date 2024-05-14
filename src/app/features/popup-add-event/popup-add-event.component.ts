import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../interfaces/project.model';

@Component({
  selector: 'app-popup-add-event',
  templateUrl: './popup-add-event.component.html',
  styleUrls: ['./popup-add-event.component.scss']
})
export class PopupAddEventComponent implements OnInit {
  addEventForm: FormGroup;
  token: string;
  project: Project;

  constructor(
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<PopupAddEventComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
      this.token = this.dialogData.token;
      this.project = this.dialogData.project;

      this.addEventForm = this.fb.group({
        intitule: [''],
        dateEvent: [],
        timeEvent: []
      })
  }
  ngOnInit() {
  }

  getControl(controlName: string) {
    return this.addEventForm.get(controlName);
  }

  submit() {
    const formValue = this.addEventForm.value;
    console.log(formValue);
    
  }

}
