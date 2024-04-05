import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../interfaces/project.model';
import { EventSchedule } from '../interfaces/event-schedule';

@Component({
  selector: 'app-apply-project-dialog',
  templateUrl: './apply-project-dialog.component.html',
  styleUrls: ['./apply-project-dialog.component.scss']
})

export class ApplyProjectDialogComponent implements OnInit {
  creneaux: any = null;
  selectedCreneaux: Array<any> = [];
  id!: string;
  listProjects: Project[] = [];
  listEventSchedule: EventSchedule[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // this.id = params['id'];
    });
    this.id = '1451';

    this.getProject(this.id);

    // this.formatDateInDisponibilities();
    // console.log(this.listEventSchedule);
    

    this.creneaux = [
      {
        "id": "1",
        "day": "Lundi",
        "date": "16/03/2024",
        "hour": "10h30mn"
      },
      {
        "id": "2",
        "day": "Mardi",
        "date": "17/03/2024",
        "hour": "09h00mn"
      },
      {
        "id": "3",
        "day": "Mercredi",
        "date": "86/03/2024",
        "hour": "10h30mn"
      },
      {
        "id": "4",
        "day": "Mercredi",
        "date": "86/03/2024",
        "hour": "10h30mn"
      },
    ]
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
        console.log('Tous les projets ont été récupérés avec succès!');
        console.log(this.listEventSchedule);
        
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

  onSelected(value: any) {
    this.addOrRemoveElement(value.id);

  }

  isSelected(item: any) {
    return this.selectedCreneaux.indexOf(item);
  }

  addOrRemoveElement(element: any): void {
    const index = this.selectedCreneaux.indexOf(element);
    if (index === -1) {
        this.selectedCreneaux.push(element);
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
