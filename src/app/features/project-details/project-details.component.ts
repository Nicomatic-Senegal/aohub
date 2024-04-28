import { Component } from '@angular/core';
import { ShowMoreDialogComponent } from '../show-more-dialog/show-more-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { PopupDeleteProjectComponent } from '../popup-delete-project/popup-delete-project.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {

  project?: any;

  constructor(public dialog: MatDialog) {
    this.project = {
        "title": "Project A",
        "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcxNDM1MTM5OSwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzE0MjY0OTk5fQ.kTrFTyybkbQ6ir5E2OzQLlzOMk_hNv5InPqNovE-UpVdWl6sDCosxnsFoAyn3OueQ2SYqNjoeMP6ICjS5IHPZg",
        "id": "123",
        "description": "Développement de Solutions de Connectivité pour des Applications Spatiales vise à concevoir et à fabriquer des connecteurs spécifiquement adaptés aux exigences uniques des applications spatiales. Ces connecteurs joueront un rôle crucial dans la connectivité des systèmes électroniques embarqués dans des satellites, des sondes spatiales et d'autres engins spatiaux. Le projet comprendra plusieurs phases allant de la recherche et de la conception à la fabrication et aux tests, avec pour objectif ultime de fournir des solutions de connectivité fiables et robustes pour les missions spatiales",
        "status": "In progress",
        "deadline": "2024-05-15",
        "team": ["John", "Emily", "Michael"],
        "progress": 60
      };
    
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
    this.dialog.open(PopupDeleteProjectComponent, {
      hasBackdrop: true,
      data: {
        title, description, project
      },
      panelClass: 'custom-dialog-container'
    });
  }
    

}
