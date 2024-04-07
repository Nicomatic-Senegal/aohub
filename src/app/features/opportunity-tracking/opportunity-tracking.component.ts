import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerService } from '../services/partner/partner.service';
import { ProjectService } from '../services/project/project.service';
import { Project } from '../interfaces/project.model';
import { PartnerDTO } from '../interfaces/partner.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-opportunity-tracking',
  templateUrl: './opportunity-tracking.component.html',
  styleUrls: ['./opportunity-tracking.component.scss']
})
export class OpportunityTrackingComponent implements OnInit {
  token!: string;
  listProject: Project[] = [];
  listPositionners: Map<string, PartnerDTO[]> = new Map<string, PartnerDTO[]>();
  screen: number = 1;

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
        // Créer un tableau d'observables
        const observables = this.listProject.map(project => {
          return this.projectService.getPartnersInMyProjects(this.token, project.id);
        });

        // Utiliser forkJoin pour attendre que toutes les requêtes se terminent
        forkJoin(observables).subscribe({
          next: (data1) => {
              // data1 est un tableau contenant les résultats de toutes les requêtes
              this.listProject.forEach((project, index) => {
                  const data = data1[index];
                  this.listPositionners.set(project.title!, data);
              });
          },
          error: (err) => {
              console.error(err);
          }
        });
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
}
