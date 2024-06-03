import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PreSalesComponent } from '../../dialog/pre-sales/pre-sales.component';
import { Project } from '../../interfaces/project.model';
import { PhaseDTO } from '../../interfaces/phase.model';
import { TaskDTO } from '../../interfaces/task.model';
import { InitPhaseComponent } from '../../dialog/init-phase/init-phase.component';

@Component({
  selector: 'app-project-tracking',
  templateUrl: './project-tracking.component.html',
  styleUrls: ['./project-tracking.component.scss']
})
export class ProjectTrackingComponent implements OnInit {
  token: string;
  @Input() project!: Project;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService) {
      authService.loggedOut();
      this.token = authService.isLogged()!;

  }

  ngOnInit() {
    this.project.phases?.sort((a, b) => a.id! - b.id!);
    this.project.phases?.forEach(p => {
      p.tasks?.sort((a, b) => a.id! - b.id!);
    });
    console.log(this.project);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && !changes['project'].firstChange) {
      this.project.phases?.sort((a, b) => a.id! - b.id!);
      this.project.phases?.forEach(p => {
        p.tasks?.sort((a, b) => a.id! - b.id!);
      });
      console.log(this.project);
    }
  }

  openPreSalesDialog(phase: PhaseDTO) {
    const teamMembers = this.project.teamMembers
    const project = this.project;

    this.dialog.open(PreSalesComponent, {
      hasBackdrop: true,
      data: {
        phase, teamMembers, project
      },
      panelClass: 'custom-dialog-container'
    })
  }

  openInitDialog(task: TaskDTO, phase: PhaseDTO) {
    const teamMembers = this.project.teamMembers;
    phase.project ={ id: this.project.id, createdAt: this.project.createdAt};
    this.dialog.open(InitPhaseComponent, {
      hasBackdrop: true,
      data: {
        task, teamMembers, phase
      },
      panelClass: 'custom-dialog-container'
    })
  }

  isExpired(dateString: Date, taskStatus: boolean)  {
    if (!dateString)
      return false;
    const today = new Date();
    const endDate = new Date(dateString.toString());

    return today > endDate && !taskStatus;
  }

  isTaskDone(done: boolean | undefined) {
    if (!done)
      return false;
    return done;
  }

  sortTaskByDone(tasks: TaskDTO[]) {
    return tasks.map(task => task.done).sort((a, b) => {
      if (a === b) {
        return 0;
      } else if (a) {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
