import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../services/project/project.service';

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styleUrls: ['./project-options.component.scss']
})
export class ProjectOptionsComponent {
  screen: number = 1;
  token: string;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private route: Router,
    private authService: AuthService) {
      authService.loggedOut();
      this.token = authService.isLogged()!;

  }

  nextScreeen(num: number) {
    this.screen = num;
  }

  back() {
    this.route.navigate(['/projects']);
  }
}
