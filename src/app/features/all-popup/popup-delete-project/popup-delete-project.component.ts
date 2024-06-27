import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-popup-delete-project',
  templateUrl: './popup-delete-project.component.html',
  styleUrls: ['./popup-delete-project.component.scss']
})
export class PopupDeleteProjectComponent implements OnInit {
  selectedReason?: string;
  otherReason: string = '';

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<PopupDeleteProjectComponent>,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.selectedReason = 'not_enough_staff';
  }

  onDelete(token: string, projectId: number) {
    let reasonToSend: string;
    if (this.selectedReason === 'other') {
      reasonToSend = this.otherReason;
    } else {
      reasonToSend = this.selectedReason || '';
    }
    this.projectService.deleteProject(token, projectId, reasonToSend).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/projects']);
        this.translateService.get(['SUCCESS_DELETE_PROJECT', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_DELETE_PROJECT'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_DELETE_PROJECT', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_DELETE_PROJECT'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
    this.onCloseDialog();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  onReasonChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.selectedReason = value;
  }

}
