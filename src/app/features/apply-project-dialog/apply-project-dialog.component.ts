import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../interfaces/project.model';
import { EventSchedule } from '../interfaces/event-schedule';
import { Disponibility } from '../interfaces/disponibility.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-apply-project-dialog',
  templateUrl: './apply-project-dialog.component.html',
  styleUrls: ['./apply-project-dialog.component.scss']
})

export class ApplyProjectDialogComponent implements OnInit {
  token: string;
  creneaux: any = null;
  selectedCreneaux: EventSchedule[] = [];
  projectId!: string;
  listProjects: Project[] = [];
  listEventSchedule: EventSchedule[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService
  ) { 
    this.token = authService.isLogged()!;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // this.id = params['id'];
    });
    this.projectId = '1451';

    this.getProject(this.projectId);
  }

  onApply() {
    if (this.selectedCreneaux.length > 0) {
      const payload = {
        disponibilities: this.selectedCreneaux.map(item => ({ id: item.id })),
        projectId: this.projectId
      };
  
      this.projectService.positioning(this.token, payload).subscribe({
        next: (data) => {
          this.toastr.success("Vous vous êtes positionné au projet avec succès", "Succès !", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
          this.router.navigate(["/opportunities"]);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.detail, "Erreur !", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
  
        }
      })
    } else {
      this.toastr.warning("Veuillez choisir au moins un créneau", "Attention !", {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
    }
  }

  getProject(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.listProjects.push(data);
        this.listProjects = this.listProjects.flatMap(data => data);
        this.formatDateInDisponibilities(data);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      },
      complete: () => {
        
      }
    });
  }

  formatDateInDisponibilities(project: Project) {
    if (project.disponibilities) {
      project.disponibilities.forEach(disponibility => {
        const instant = new Date(disponibility.instant);
        const disponibilityId = disponibility.id;
        const eventSchedule: EventSchedule = {
          id: disponibilityId,
          dayOfWeek: this.getDayOfWeek(instant.getDay()),
          day: instant.getDate(),
          month: instant.getMonth() + 1,
          year: instant.getFullYear(),
          hour: instant.getHours(),
          minute: instant.getMinutes()
        };
        this.listEventSchedule.push(eventSchedule);
      });
    }
  }

  getDayOfWeek(day: number) {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return jours[day];
  }

  onSelected(value: EventSchedule) {
    this.addOrRemoveElement(value);
  }

  isSelected(item: EventSchedule) {
    return this.selectedCreneaux.indexOf(item);
  }

  addOrRemoveElement(element: EventSchedule): void {
    const index = this.selectedCreneaux.indexOf(element);
    if (index === -1) {
        this.selectedCreneaux.push(element);
        console.log(element);
        
        return;
    } else {
        // this.selectedCreneaux.splice(index, 1);
        this.selectedCreneaux = this.selectedCreneaux.filter(item => item !== this.selectedCreneaux[index]);
    }
  }

  backStep() {
    this.router.navigate(['opportunities'])
  }
}
