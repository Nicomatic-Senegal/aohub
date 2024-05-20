import { Component, Input, OnInit } from '@angular/core';
import { ShowMoreDialogComponent } from '../../dialog/show-more-dialog/show-more-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupDeleteProjectComponent } from '../../all-popup/popup-delete-project/popup-delete-project.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerDetailsDialogComponent } from '../../dialog/partner-details-dialog/partner-details-dialog.component';
import { PopupModifyProjectComponent } from '../../all-popup/popup-modify-project/popup-modify-project.component';
import { Project } from '../../interfaces/project.model';
import { UserService } from '../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { PopupAddEventComponent } from '../../all-popup/popup-add-event/popup-add-event.component';
import { EventService } from '../../services/event/event.service';
import { PopupComponent } from '../../all-popup/popup/popup.component';
import { PopupAddParticipantComponent } from '../../all-popup/popup-add-participant/popup-add-participant.component';

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
  events: any;
  showDeleteIcon: boolean = false;

  constructor(public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private eventService: EventService,
    private toastr: ToastrService) {
    this.token = authService.isLogged()!;
    this.loadCurrentConnectedUser();

  }

  ngOnInit(): void {
    this.getAllEvents();
  }

  loadCurrentConnectedUser() {
    const userData = localStorage.getItem("currentConnectedUser");

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
            positionClass: 'toast-top-right',
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

  getAllEvents() {
    this.eventService.getAllEvents(this.token).subscribe({
      next: (data) =>{
        this.events = data;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception des évènements", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      }
    })
  }

  addEvenementDialog() {
    const project = this.project;
    const token = this.token;
    const dialogRef = this.dialog.open(PopupAddEventComponent, {
      data: {
        project, token
      }
    })
    dialogRef.componentInstance.eventAdded.subscribe((newEventData) => {
      this.events = [...this.events, newEventData];

    });

  }

  deleteEvent(event: Event) {
    let title = "Supprimer évènement";
    let description = "Êtes-vous sûr de vouloir supprimer cet évènement ?";

    title = localStorage.getItem('language') === 'en' ? 'Delete event' : 'Supprimer évènement';
    description = localStorage.getItem('language') === 'en' ? 'Are you sure you want to delete this event ?' : 'Êtes-vous sûr de vouloir supprimer cet évènement ?';

    let route = "deleteEvent";

    let token = this.token;

    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        title, description, route, event, token
      }
    })
    dialogRef.componentInstance.eventRemoved.subscribe((eventId) => {
      this.events = this.events.filter((event: { id: any; }) => event.id !== eventId);
    });
  }

  addParticipantDialog() {
    const token = this.token;
    const project = this.project;

    const dialogRef = this.dialog.open(PopupAddParticipantComponent, {
      data: {
        token, project
      }
    })
    dialogRef.componentInstance.participantAdded.subscribe((newEventData) => {
      console.log(newEventData);
      this.project = newEventData;
    })
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

}
