import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { BaseAppService } from 'src/app/core/services/base-app/base-app.service';

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
    private enterpriseService: EnterpriseService,
    private baseApp: BaseAppService
    )
  {
    // authService.loggedOut();
    // this.token = authService.isLogged()!;
}

  nextScreeen(num: number) {
    this.screen = num;
  }
}
