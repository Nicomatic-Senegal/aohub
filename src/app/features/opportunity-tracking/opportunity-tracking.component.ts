import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerService } from '../services/partner/partner.service';
import { ProjectService } from '../services/project/project.service';
import { Project } from '../interfaces/project.model';
import { PartnerDTO } from '../interfaces/partner.model';
import { forkJoin } from 'rxjs';
import { PositioningDTO, PositioningStatus } from '../interfaces/positioning-dto.model';
import { Disponibility } from '../interfaces/disponibility.model';
import { data } from 'jquery';
import { digitOnly } from '../interfaces/utils';

@Component({
  selector: 'app-opportunity-tracking',
  templateUrl: './opportunity-tracking.component.html',
  styleUrls: ['./opportunity-tracking.component.scss']
})
export class OpportunityTrackingComponent implements OnInit {
  token!: string;
  listProject: Project[] = [];
  listPositionners: Map<string, PositioningDTO[]> = new Map<string, PositioningDTO[]>();
  screen: number = 1;
  positioners: Array<Array<PositioningDTO>> = [];


  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private route: Router,
    private authService: AuthService,) {
      authService.loggedOut();
      this.token = authService.isLogged()!;

  }

  ngOnInit(): void {
    this.projectService.getAllMyProjects(this.token).subscribe({
      next: (data) => {

        this.listProject = data;
        this.listProject.forEach(project => {
          this.projectService.getPartnersInMyProjects(this.token, project.id).subscribe({
            next: (data1) => {
                this.positioners[project.id] = data1;
                console.log(this.positioners);

            },
            error: (err) => {
                console.error(err);
            }
          });
        });
        // Utiliser forkJoin pour attendre que toutes les requêtes se terminent

      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }
  gotoHome() {
    this.route.navigate(['/projets']);
  }

  nextScreeen(num: number) {
    this.screen = num;
  }

  getAllDisponibility(dispo: Disponibility[]) {
    if (dispo)
      return dispo.map(d => d.instant);
    return null;
  }

  validatePositioning(idProject: number, indice: number, idPos: number) {
    this.projectService.validatePositioning(this.token, idPos).subscribe({
      next: (data) => {
        this.positioners[idProject][indice].status = PositioningStatus.ACCEPTED;
        this.toastr.success("vous avez validé le partenaire.", "Succés", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      },
      error: (err) => {
        this.toastr.error("Erreur pendant la validation.", "Erreur", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  rejectPositioning(idProject: number, indice: number, idPos: number) {
    this.projectService.rejectPositioning(this.token, idPos).subscribe({
      next: (data) => {
        this.positioners[idProject][indice].status = PositioningStatus.REJECTED;
        this.toastr.success("vous avez rejeté le partenaire.", "Succés", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      },
      error: (err) => {
        this.toastr.error("Erreur pendant la rejection.", "Erreur", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    digitOnly(event);
  }

  onValidRallonge() {

  }

  status(value?: PositioningStatus, ) {

    if(value) {
      switch(value) {
        case PositioningStatus.ACCEPTED: return 1;
        case PositioningStatus.REJECTED: return 2;
        default: return 3;
      }
    }
    return 3;
  }
}
