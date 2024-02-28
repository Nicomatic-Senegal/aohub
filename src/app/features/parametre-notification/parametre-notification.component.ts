import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-parametre-notification',
  templateUrl: './parametre-notification.component.html',
  styleUrls: ['./parametre-notification.component.scss']
})
export class ParametreNotificationComponent {
  token!: string;

  constructor(private route: Router, private authService: AuthService, private fb: FormBuilder){
    if (!localStorage.getItem("token")) {
      this.route.navigate(['/signin']);
      return;
    }
    const item = localStorage.getItem("token");
    if (typeof item == "string") {
      this.token = item;
    }
  }
}
