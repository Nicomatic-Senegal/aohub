import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

@Component({
  selector: 'app-project-documents-dialog',
  templateUrl: './project-documents-dialog.component.html',
  styleUrls: ['./project-documents-dialog.component.scss']
})
export class ProjectDocumentsDialogComponent {
  token: string;
  project!: Project;
  currentConnectedUser?: any;
  allDocuments: Array<AttachmentDto> = [];
  hover: boolean = false;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    private dialog: MatDialog,
    private userService: UserService,

    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    console.log(this.dialogData.project);
    this.project = this.dialogData.project;

    this.loadProjectDocuments();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadProjectDocuments() {
    this.projectService.getProjectAttachments(this.token, this.project.id).subscribe({
      next: (data) => {
        console.log(data);
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
    console.log(file);
    this.projectService.deleteAttachment(this.token, file.id).subscribe({
      next: (data) => {
        console.log(data);
        this.loadProjectDocuments();
        this.toastr.success("Ce Document a été supprimé avec succès", "Succès", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });

      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Erreur lors de la suppression du document", "Erreur", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });

      }
    })
  }

  uploadFile() {

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
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
         });
        }
      })
    }
  }
}
