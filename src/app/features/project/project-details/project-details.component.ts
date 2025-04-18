import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
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
import {PopupFeedbackComponent} from "../../all-popup/popup-feedback/popup-feedback.component";
import {ProjectService} from "../../services/project/project.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnChanges {

  @Input() project: any;
  token: string;
  currentConnectedUser?: any;
  events: any;
  domainTranslationMap: Record<string, string> = {
    "Décolletage" : "BAR_TURNING",
    "Plasturgie": "PLASTICS_TRANSFORMATION",
    "Traitement de surface": "SURFACE_TREATMENT",
    "Assemblage": "ASSEMBLY",
    "Usinage": "MACHINING",
    "Produit standard": "STANDARD_PRODUCT",
    "Découpe": "CUTTING_STAMPING",
    "Électronique": "ELECTRONICS",
    "Découpe laser": "LASER_CUTTING"
  };
  roleTranslationMap: Record<string, string> = {
    "Responsable produit" : "ROLE_PRODUCT_MANAGER",
    "Commercial": "ROLE_SALES",
    "Acheteur": "ROLE_BUYER",
    "Négociateur": "ROLE_NEGOTIATOR",
    "Designer": "ROLE_DESIGNER",
    "Directeur": "ROLE_DIRECTOR",
    "Autre": "OTHER"
  };
  marketTranslationMap: Record<string, string> = {
    "Automobile": "AUTOMOBILE",
    "Aéronautique": "AERONAUTICS",
    "Énergie": "ENERGY",
    "Électronique": "ELECTRONICS",
    "Spatial": "SPACE",
    "R&D": "R_AND_D",
    "Ingénierie": "ENGINEERING",
    "Médical": "MEDICAL",
    "Aérospatial": "AEROSPACE",
    "Militaire": "MILITARY",
    "Industriel": "INDUSTRIAL",
    "Mobilité urbaine": "URBAN_MOBILITY",
    "Autre": "OTHER"
  };

  constructor(public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private eventService: EventService,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private translateService: TranslateService
  ) {
    this.token = authService.isLogged()!;
    this.loadCurrentConnectedUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && !changes['project'].firstChange) {
      this.getAllEvents();
      if (this.areAllPhasesDone()) {
        this.setProjectStatusToFinished();
      }
    }
    console.log(this.project)
  }

  setProjectStatusToFinished() {
    this.projectService.setProjectStatusToFinished(this.token, this.project?.id).subscribe({
      next: (data) => {
        this.project = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  areAllPhasesDone(): boolean {
    if (!this.project || !this.project.phases) {
      throw new Error('Project or phases are not defined');
    }
    return this.project.phases.every((phase: any) => phase.fullyValidated === true);
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
    console.log(this.project)
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

  openFeedbackModal(): void {
    const token = this.token;
    this.dialog.open(PopupFeedbackComponent, {
      hasBackdrop: true,
      data: {
        token
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
    this.eventService.getEventsByProjectId(this.token, this.project?.id).subscribe({
      next: (data) =>{
        this.events = data;
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_FETCHING_EVENTS', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_EVENTS'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
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

  formatDate(date: Date | undefined): string {
    if (!date) {
      return '';
    }
    let language = 'fr-Fr';
    if (localStorage.getItem('language') === 'en') {
      language = 'en-En';
    }
    const dateToFormat = new Date(date);
    return dateToFormat.toLocaleString(language, { day: '2-digit', month: 'long', year: 'numeric' });
  }

  translateDomain(domain: string) {
    return this.domainTranslationMap[domain] || domain;
  }

  translateMarket(market: string) {
    return this.marketTranslationMap[market] || market;
  }

  translateRole(role: string) {
    return this.roleTranslationMap[role] || role;
  }
}
