import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PhaseDialogComponent } from '../../dialog/phase-dialog/phase-dialog.component';
import { Project } from '../../interfaces/project.model';
import { PhaseDTO } from '../../interfaces/phase.model';
import { TaskDTO } from '../../interfaces/task.model';
import { TaskDialogComponent } from '../../dialog/task-dialog/task-dialog.component';
import { ProjectDocumentsDialogComponent } from '../../dialog/project-documents-dialog/project-documents-dialog.component';

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
    }
  }

  openPhaseDialog(phase: PhaseDTO, phaseIndex: number) {
    const teamMembers = this.project.teamMembers;
    const project = this.project;

    const dialogRef = this.dialog.open(PhaseDialogComponent, {
      hasBackdrop: true,
      data: {
        phase, teamMembers, project
      },
      panelClass: 'custom-dialog-container'
    });
    dialogRef.componentInstance.projectModified.subscribe((data) => {
      if (data)
        this.project.phases![phaseIndex] = data;
    });
  }

  openTaskDialog(task: TaskDTO, phase: PhaseDTO, phaseIndex: number, taskIndex: number) {
    const teamMembers = this.project.teamMembers;
    const project = this.project;
    phase.project ={ id: this.project.id, createdAt: this.project.createdAt};
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      hasBackdrop: true,
      data: {
        task, teamMembers, phase, project
      },
      panelClass: 'custom-dialog-container'
    });
    dialogRef.componentInstance.projectModified.subscribe((data) => {
      if (data)
        this.project.phases![phaseIndex].tasks![taskIndex] = data;
    });
  }

  openDocumentDialog() {
    const project = this.project;

    this.dialog.open(ProjectDocumentsDialogComponent, {
      hasBackdrop: true,
      data: { project
      },
      panelClass: 'custom-dialog-container'
    });
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

  nbTasksDone(tasks: TaskDTO[]) {
    return tasks.filter(task => task.done === true).length;
  }

  areAllPhasesDone(): boolean {
    if (!this.project || !this.project.phases) {
      throw new Error('Project or phases are not defined');
    }
    return this.project.phases.every((phase: any) => this.nbTasksDone(phase.tasks) === phase.tasks.length);
  }

  classToApply(tasks: TaskDTO[], j: number) {
    return j + 1 < this.nbTasksDone(tasks) ?
      'bg-[#00CE2D]' :
      ( j + 1 > this.nbTasksDone(tasks) ?
        'bg-[#F0F0F0]' :
        (j + 1 !== tasks?.length ?
          'bg-gradient-to-r from-[#00CE2D] to-[#F0F0F0]' :
          'bg-[#00CE2D]'
        )
      )
  }
}
