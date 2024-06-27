import {Component, Inject, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { ApplyProjectDialogComponent } from '../apply-project-dialog/apply-project-dialog.component';
import { Project } from '../../interfaces/project.model';
import { UserService } from '../../services/user/user.service';
import { AttachmentDto, AttachmentType } from '../../interfaces/attachment-dto.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-project-documents-dialog',
  templateUrl: './project-documents-dialog.component.html',
  styleUrls: ['./project-documents-dialog.component.scss']
})
export class ProjectDocumentsDialogComponent implements OnInit {
  token: string;
  project!: Project;
  currentConnectedUser?: any;
  allDocuments: Array<AttachmentDto> = [];
  hover: boolean = false;
  filesChoosen: Array<string> = [];
  plansChoosen: Array<string> = [];
  allFiles: Array<AttachmentDto> = [];

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    private dialog: MatDialog,
    private userService: UserService,
    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private translateService: TranslateService
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    this.project = this.dialogData.project;

    this.loadProjectDocuments();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadProjectDocuments() {
    this.projectService.getProjectAttachments(this.token, this.project.id).subscribe({
      next: (data) => {
        this.allDocuments = data;
        this.allDocuments.forEach(doc => {
          doc.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(doc.base64Content)
        })
      }
    });
  }

  getAllNormalDoc() {
    return this.allDocuments.filter(doc => doc.type.toString() === "NORMAL");
  }

  getAllPlanDoc() {
    return this.allDocuments.filter(doc => doc.type.toString() === "PLAN");
  }

  getGoogleDocsViewerUrl(file: AttachmentDto): SafeResourceUrl {
    const url = `https://docs.google.com/gview?url=${encodeURIComponent(file.base64Content)}&embedded=true`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  downloadFile(file: AttachmentDto): void {
    const link = document.createElement('a');
    link.href = file.base64Content;
    link.download = file.name;
    link.click();
  }

  deleteFile(file: any) {
    this.projectService.deleteAttachment(this.token, file.id).subscribe({
      next: (data) => {
        this.loadProjectDocuments();
        this.translateService.get(['SUCCESS_DELETE_DOCUMENT', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_DELETE_DOCUMENT'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });

      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_DELETE_DOCUMENT', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_DELETE_DOCUMENT'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

  uploadFile() {
    this.allFiles.forEach(file => {
      file.project = this.project;
      this.projectService.addProjectAttachments(this.token, file).subscribe({
        next: (data) => {
          this.loadProjectDocuments();
          this.translateService.get(['SUCCESS_ADD_DOCUMENT', 'SUCCESS_TITLE']).subscribe(translations => {
            this.toastr.success(translations['SUCCESS_ADD_DOCUMENT'], translations['SUCCESS_TITLE'], {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          });

        },
        error: (err) => {
          console.log(err);
          this.translateService.get(['ERROR_ADD_DOCUMENT', 'ERROR_TITLE']).subscribe(translations => {
            this.toastr.error(translations['ERROR_ADD_DOCUMENT'], translations['ERROR_TITLE'], {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          });
        }
      });
    });
  }

  onFileSelected(event: any, indice: number) {
    const files: FileList = event.target.files;

    if (indice === 1) {
      this.filesChoosen = [];
    } else {
      this.plansChoosen = [];
    }

    const fileLoadPromises = [];

    for (let i = 0; i < files.length; i++) {
        const file: File = files[i];

        const reader = new FileReader();

        const fileLoadPromise = new Promise<void>((resolve, reject) => {
          reader.onload = () => {
            const base64String = reader.result as string;

            if (indice === 1) {
                let attachment: AttachmentDto = {
                    name: file.name,
                    type: AttachmentType.NORMAL,
                    fileSize: file.size,
                    base64Content: base64String
                };
                this.filesChoosen.push(file.name);
                this.allFiles.push(attachment);
            } else {
                let attachment: AttachmentDto = {
                    name: file.name,
                    type: AttachmentType.PLAN,
                    fileSize: file.size,
                    base64Content: base64String
                };
                this.plansChoosen.push(file.name);
                this.allFiles.push(attachment);
            }

            resolve();
          };

          reader.onerror = reject;

          if (file) {
              reader.readAsDataURL(file);
          }
        });

        fileLoadPromises.push(fileLoadPromise);
    }

    Promise.all(fileLoadPromises).then(() => {
        this.uploadFile();
    }).catch(error => {
        console.error("Error loading files:", error);
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
}
