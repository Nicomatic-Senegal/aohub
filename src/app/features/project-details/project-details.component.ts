import { Component, Input, OnInit } from '@angular/core';
import { ShowMoreDialogComponent } from '../show-more-dialog/show-more-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { PopupDeleteProjectComponent } from '../popup-delete-project/popup-delete-project.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerDetailsDialogComponent } from '../partner-details-dialog/partner-details-dialog.component';
import { PopupModifyProjectComponent } from '../popup-modify-project/popup-modify-project.component';
import { Project } from '../interfaces/project.model';
import { UserService } from '../services/user/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

  @Input() project: any;
  token: string;
  currentConnectedUser?: any;
  isCurrentUserApplicant = false;

  constructor(public dialog: MatDialog, private authService: AuthService,
    private userService: UserService, 
    private toastr: ToastrService) {
    this.token = authService.isLogged()!;
    this.loadCurrentConnectedUser();
  }

  ngOnInit(): void {
    
  }

  loadCurrentConnectedUser() {
    const userData = localStorage.getItem("currentConnectedUser");
    console.log(userData);
    
    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);
      // this.isCurrentUserApplicant = this.currentConnectedUser.id === this.project?.applicant?.id;
    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.currentConnectedUser = data;    
          // this.isCurrentUserApplicant = this.currentConnectedUser.id === this.project?.applicant?.id;
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-right-right',
         });
        }
      })
    }
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

  modifyProject(project: Project) {
    this.dialog.open(PopupModifyProjectComponent, {
      hasBackdrop: true,
      data: {
        project
      }
    })
  }

  deleteProject() {
    const title = "DELETE_PROJECT_TITLE";
    const description = "DELETE_PROJECT_DESCRIPTION";
    const project = this.project;
    const token = this.token;
    this.dialog.open(PopupDeleteProjectComponent, {
      hasBackdrop: true,
      data: {
        title, description, token, project
      },
      panelClass: 'custom-dialog-container'
    });
  }

  openPartnerDetailsDialog(partner: any) {
    this.dialog.open(PartnerDetailsDialogComponent, {
      hasBackdrop: true,
      data: {
        partner
      },
      panelClass: 'custom-dialog-container'
    })
  }
    

}
