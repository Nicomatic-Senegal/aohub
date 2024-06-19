import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { ApplyProjectDialogComponent } from '../apply-project-dialog/apply-project-dialog.component';

@Component({
  selector: 'app-feasibility-phase',
  templateUrl: './stop-project-dialog.component.html',
  styleUrls: ['./stop-project-dialog.component.scss']
})
export class StopProjectDialogComponent {
  token: string;
  selectedReason?: string;
  otherReason: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ApplyProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.selectedReason = 'not_enough_staff';
  }

  onStop(token: string, projectId: number) {
    let reasonToSend: string;
    if (this.selectedReason === 'other') {
      reasonToSend = this.otherReason;
    } else {
      reasonToSend = this.selectedReason || '';
    }

    const reasons = {"reason": reasonToSend};
    console.log(token);

    this.projectService.stopProject(this.token, projectId, reasons).subscribe({
      next: (data) => {
        console.log(data);
        this.toastr.success("Ce projet a été arrété avec succès", "Succès", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
       this.dialogRef.close();
       this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Erreur lors de l'arrêt du projet", "Erreur", {
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
