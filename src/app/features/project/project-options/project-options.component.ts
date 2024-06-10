import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../interfaces/project.model';

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styleUrls: ['./project-options.component.scss']
})
export class ProjectOptionsComponent implements OnInit {
  screen: number = 1;
  token: string;
  project!: Project;
  param1: string | null = null;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        const projectId = params['id'];
        this.param1 = params['param1'];
        this.getProjectById(this.token, projectId);
    });
    console.log(this.param1);

    if (this.param1)
      this.screen = 2;
  }

  getProjectById(token: string, projectId: string) {
    this.projectService.getProjectById(token, projectId).subscribe({
      next: (data) => {
        this.project = data;

      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la récupération du projet", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  nextScreeen(num: number) {
    this.screen = num;
  }

  back() {
    this.router.navigate(['/projects']);
  }
}
