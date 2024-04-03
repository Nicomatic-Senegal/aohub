import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BaseAppService } from 'src/app/core/services/base-app/base-app.service';

@Component({
  selector: 'app-parametre-notification',
  templateUrl: './parametre-notification.component.html',
  styleUrls: ['./parametre-notification.component.scss']
})
export class ParametreNotificationComponent {
  token!: string;

  constructor(private route: Router, private authService: AuthService, private fb: FormBuilder, private baseApp: BaseAppService){
    authService.loggedOut();
    this.token = authService.isLogged()!;
  }
}
