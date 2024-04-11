import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../interfaces/project.model';
import { EventSchedule } from '../interfaces/event-schedule';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-apply-project-dialog',
  templateUrl: './apply-project-dialog.component.html',
  styleUrls: ['./apply-project-dialog.component.scss']
})

export class ApplyProjectDialogComponent implements OnInit {
  token: string;
  project!: Project;
  selectedCreneaux: EventSchedule[] = [];
  
  listEventSchedule: EventSchedule[] = [];

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

  ngOnInit() {
    this.project = this.dialogData.project;
    this.formatDateInDisponibilities(this.project);
  }

  onApply() {
    if (this.selectedCreneaux.length > 0) {
      const project = { id: this.project.id };
      const payload = {
        disponibilities: this.selectedCreneaux.map(item => ({ id: item.id })),
        project
      };

      this.projectService.positioning(this.token, payload).subscribe({
        next: (data) => {
          this.toastr.success("Vous vous êtes positionné au projet avec succès", "Succès !", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
          this.dialogRef.close({ positionApplied: true });
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

  formatDateInDisponibilities(project: Project) {
    if (project.disponibilities) {
      project.disponibilities.forEach(disponibility => {
        const instant = new Date(disponibility.instant!);
        const disponibilityId = disponibility.id;
        const eventSchedule: EventSchedule = {
          id: disponibilityId!,
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
}
