import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
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
        this.toastr.success("Ce projet a été supprimé avec succès", "Succès", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur lors de la suppression du projet", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      }
    });
    this.onCloseDialog();
    console.log(reasonToSend);
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
