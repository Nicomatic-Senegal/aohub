import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project/project.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../interfaces/project.model';
import { Market } from '../../interfaces/market.model';
import { Domain } from '../../interfaces/domain.model';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-popup-modify-project',
  templateUrl: './popup-modify-project.component.html',
  styleUrls: ['./popup-modify-project.component.scss']
})
export class PopupModifyProjectComponent implements OnInit {
  modifyProjectForm: FormGroup;
  token: string;
  markets: Market[] = [];
  projectUpdated: Project;
  domains: Domain[] = [];
  domainChoosen: Array<string> = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<PopupModifyProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private translateService: TranslateService
  ) {

    this.projectUpdated = this.dialogData.project;
    this.token = authService.isLogged()!;

    this.domainChoosen = this.dialogData.project.domains.map((domain: { name: any; }) => domain.name);

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
    });

    this.projectService.getAllMarkets(this.token).subscribe({
      next: (data) => {
        this.markets = data;
      },
      error: (err) => {
        this.translateService.get(['ERROR_FETCHING_MARKETS', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_MARKETS'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });

    this.projectService.getAllDomains(this.token).subscribe({
      next: (data) => {
        this.domains = data;
      },
      error: (err) => {
        this.translateService.get(['ERROR_FETCHING_DOMAINS', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_DOMAINS'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });

  }

  ngOnInit() {
  }

  getControl(controlName: string) {
    return this.modifyProjectForm.get(controlName);
  }

  submit() {
    const formValue = this.modifyProjectForm.value;

    this.projectUpdated.title = formValue.intitule;
    this.projectUpdated.description = formValue.description;
    this.projectUpdated.client = formValue.client;
    this.projectUpdated.duration = formValue?.contractDuration;
    this.projectUpdated.earliestDeadline = formValue?.earliestDeadline;
    this.projectUpdated.latestDeadline = formValue?.latestDeadline;
    this.projectUpdated.budget = formValue?.budget;
    this.projectUpdated.globalVolume = formValue.globalVolume;
    this.projectUpdated.domains = this.domains.filter(domain => this.domainChoosen.includes(domain.name));

    const filteredMarkets = this.markets.filter((market => market.name == formValue.market));
    this.projectUpdated.markets = filteredMarkets;

    this.projectService.updateProject(this.token, this.projectUpdated, this.dialogData.project.id).subscribe({
      next: (data) => {
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_UPDATE_PROJECT', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_UPDATE_PROJECT'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

  onSelectDomain(value: any) {
    if (this.domainChoosen.indexOf(value) === -1) {
      this.domainChoosen.push(value);
    }
  }

  removeDomain(item: string) {
    this.domainChoosen.splice(this.domainChoosen.indexOf(item), 1);
  }

}
