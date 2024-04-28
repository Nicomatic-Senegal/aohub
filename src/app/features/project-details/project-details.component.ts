import { Component, Input } from '@angular/core';
import { ShowMoreDialogComponent } from '../show-more-dialog/show-more-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { PopupDeleteProjectComponent } from '../popup-delete-project/popup-delete-project.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {

  @Input() project: any;
  token: string;

  constructor(public dialog: MatDialog, private authService: AuthService,) {
    this.token = authService.isLogged()!;
  }

  openShowMoreDialog(title: string, description: string) {
    this.dialog.open(ShowMoreDialogComponent, {
      hasBackdrop: true,
      data: {
        title, description
      },
      panelClass: 'custom-dialog-container'
    });
  }

  deleteProject() {
    const title = "DELETE_PROJECT_TITLE";
    const description = "DELETE_PROJECT_DESCRIPTION";
    const project = this.project;
    const token = this.token;
    this.dialog.open(PopupDeleteProjectComponent, {
      hasBackdrop: true,
      data: {
        title, description, project
      },
      panelClass: 'custom-dialog-container'
    });
  }
    

}
