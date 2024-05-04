import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../services/project/project.service';
import { format } from 'date-fns';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from '../interfaces/project.model';

@Component({
  selector: 'app-popup-modify-project',
  templateUrl: './popup-modify-project.component.html',
  styleUrls: ['./popup-modify-project.component.scss']
})
export class PopupModifyProjectComponent implements OnInit {
  modifyProjectForm: FormGroup;
  token: string;
  markets: any;
  projectUpdated: Project = {
    id: 0,
    createdAt: new Date
  };

  constructor(
    private fb: FormBuilder, 
    private projectService: ProjectService,
    private authService: AuthService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {

    this.token = authService.isLogged()!;
    this.modifyProjectForm = this.fb.group({
      intitule: new FormControl(dialogData.project.title, [Validators.required]),
      description: new FormControl(dialogData.project.description, [Validators.required]),
      client: new FormControl(dialogData.project.client, [Validators.required]),
      market: new FormControl(dialogData.project.markets[0].name, [Validators.required]),
      contractDuration: new FormControl(dialogData.project.duration),
      earliestDeadline: new FormControl(dialogData.project.earliestDeadline),
      latestDeadline: new FormControl(dialogData.project.latestDeadline),
      budget: new FormControl(dialogData.project.budget, [Validators.required]),
      globalVolume: new FormControl(dialogData.project.globalVolume, [Validators.required]),
    })
    // const dayStart = new Date();
    // const dayEnd = new Date();
    // this.modifyProjectForm.patchValue({
    //   earliestDeadline: format(dayStart, 'yyyy-MM-dd'),
    //   latestDeadline: format(dayEnd, 'yyyy-MM-dd')
    // });

    this.projectService.getAllMarkets(this.token).subscribe({
      next: (data) => {
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception des marchés", {
          timeOut: 3000,
          positionClass: 'toast-right-right',
       });
      }
    })
    
  }

  ngOnInit() {
  }

  getControl(controlName: string) {
    return this.modifyProjectForm.get(controlName);
  }

  submit() {
    const formValue = this.modifyProjectForm.value;
    
    this.projectUpdated.id = this.dialogData.project.id;
    this.projectUpdated.title = formValue.intitule;
    this.projectUpdated.description = formValue.description;
    this.projectUpdated.client = formValue.client;
    this.projectUpdated.duration = formValue?.contractDuration;
    this.projectUpdated.earliestDeadline = formValue?.earliestDeadline;
    this.projectUpdated.latestDeadline = formValue?.latestDeadline;
    this.projectUpdated.budget = formValue?.budget;
    this.projectUpdated.globalVolume = formValue.globalVolume;

    console.log(this.token);
    console.log(this.projectUpdated);
    
    this.projectService.updateProject(this.token, this.projectUpdated, this.dialogData.project.id).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la mise à jour des projets", {
          timeOut: 3000,
          positionClass: 'toast-right-right',
        });
      }
    })
  }

}
