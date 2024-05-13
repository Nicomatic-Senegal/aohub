import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BaseAppService } from 'src/app/core/services/base-app/base-app.service';
import { NotificationDto } from '../interfaces/notification-model';
import { NotificationService } from '../services/notification-service/notification-service.service';

@Component({
  selector: 'app-parametre-notification',
  templateUrl: './parametre-notification.component.html',
  styleUrls: ['./parametre-notification.component.scss']
})
export class ParametreNotificationComponent {
  token!: string;
  currentConnectedUser: any;
  notifSetting: NotificationDto = {
    opportunityEmail: false,
    reminderEmail: false,
    assigningEmail: false,
    partner: 0
  };

  constructor(private route: Router, private authService: AuthService, private notificationService: NotificationService){
    authService.loggedOut();
    this.token = authService.isLogged()!;

    const userData = localStorage.getItem("currentConnectedUser");
    console.log(userData);

    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);
      if (this.currentConnectedUser.notificationSettings && this.currentConnectedUser.notificationSettings.length != 0) {
        this.notifSetting = this.currentConnectedUser.notificationSettings[0];
      }
      console.log(this.notifSetting);
    }
  }

  changeSetting(value: number) {
    console.log(this.notifSetting);
    switch(value) {
      case 1: this.notifSetting.assigningEmail = !this.notifSetting.assigningEmail; break;
      case 2: this.notifSetting.opportunityEmail = !this.notifSetting.opportunityEmail; break;
      case 3: this.notifSetting.reminderEmail = !this.notifSetting.reminderEmail; break;
    }

    if (this.notifSetting.partner === 0) {
      this.notifSetting.partner = this.currentConnectedUser.id;
      this.notificationService.setSetting(this.token, this.notifSetting);
    } else {
      this.notificationService.updateSetting(this.token, this.notifSetting);
    }
    this.currentConnectedUser.notificationSettings[0] = this.notifSetting;
    console.log(this.currentConnectedUser);

    localStorage.setItem("currentConnectedUser", JSON.stringify(this.currentConnectedUser));
  }
}
