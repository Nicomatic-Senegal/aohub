import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../interfaces/project.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AttachmentDto,
  AttachmentType,
} from '../../interfaces/attachment-dto.model';

@Component({
  selector: 'app-apply-project-dialog',
  templateUrl: './apply-project-dialog.component.html',
  styleUrls: ['./apply-project-dialog.component.scss'],
})
export class ApplyProjectDialogComponent implements OnInit {
  token: string;
  project!: Project;
  fileSelected: AttachmentDto | null = null;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private translateService: TranslateService
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit() {
    this.project = this.dialogData.project;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.fileSelected = {
        name: file.name,
        type: AttachmentType.POSITIONNING,
        fileSize: file.size,
        base64Content: base64String,
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onApply() {
    if (!this.fileSelected) {
      this.translateService
        .get(['WARNING_UPLOAD_FILE', 'WARNING_TITLE'])
        .subscribe((translations) => {
          this.toastr.warning(
            translations['WARNING_UPLOAD_FILE'],
            translations['WARNING_TITLE'],
            {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            }
          );
        });
      return;
    }

    const payload = {
      project: { id: this.project.id },
      attachment: this.fileSelected,
    };

    this.projectService.positioning(this.token, payload).subscribe({
      next: () => {
        this.translateService
          .get(['SUCCESS_APPLY_TO_PROJECT', 'SUCCESS_TITLE'])
          .subscribe((translations) => {
            this.toastr.success(
              translations['SUCCESS_APPLY_TO_PROJECT'],
              translations['SUCCESS_TITLE'],
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          });
        this.dialogRef.close({ positionApplied: true });
      },
      error: (err) => {
        console.log(err);
        this.translateService
          .get(['ERROR_APPLY_TO_PROJECT', 'ERROR_TITLE'])
          .subscribe((translations) => {
            this.toastr.error(
              translations['ERROR_APPLY_TO_PROJECT'],
              translations['ERROR_TITLE'],
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          });
      },
    });
  }
}
