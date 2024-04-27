import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../services/project/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  token: string;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private route: Router,
    private authService: AuthService) {
      authService.loggedOut();
      this.token = authService.isLogged()!;

  }

  changeFilter(value: string, flagUrl: string) {
  }

  projectOptions(id: number) {
    this.route.navigate(["/project-options"])
  }
}
