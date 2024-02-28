import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnterpriseService } from '../services/enterprise/enterprise.service';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent {
  screen: number = 1;
  token!: string;

  constructor(
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService
    )
  {
    if (!localStorage.getItem("token")) {
      this.route.navigate(['/signin']);
      return;
    }
    const item = localStorage.getItem("token");
    if (typeof item == "string") {
      this.token = item;
    }
}

  nextScreeen(num: number) {
    this.screen = num;
  }
}
