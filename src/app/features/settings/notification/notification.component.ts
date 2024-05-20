import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BaseAppService } from 'src/app/core/services/base-app/base-app.service';
import { NotificationDto } from '../../interfaces/notification-model';
import { NotificationService } from '../../services/notification-service/notification-service.service';

@Component({
  selector: 'app-parametre-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  token!: string;
  currentConnectedUser: any;
  notifSetting: NotificationDto = {
    opportunityEmail: false,
    reminderEmail: false,
    assigningEmail: false,
    partner: {
      id: 0
    }
  };

  constructor(private route: Router, private authService: AuthService, private notificationService: NotificationService){
    authService.loggedOut();
    this.token = authService.isLogged()!;

    const userData = localStorage.getItem("currentConnectedUser");
    console.log(userData);

    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);
      if (this.currentConnectedUser.notificationSettings && this.currentConnectedUser.notificationSettings.length != 0) {
        this.notifSetting.id = this.currentConnectedUser.notificationSettings[0].id;
        this.notifSetting.assigningEmail = this.currentConnectedUser.notificationSettings[0].assigningEmail;
        this.notifSetting.opportunityEmail = this.currentConnectedUser.notificationSettings[0].opportunityEmail;
        this.notifSetting.reminderEmail = this.currentConnectedUser.notificationSettings[0].id;
        this.notifSetting.partner.id = this.currentConnectedUser.notificationSettings[0].partner.id;
      }
      console.log(this.notifSetting);
    }
  }

  changeSetting(value: number) {
    switch(value) {
      case 1: this.notifSetting.assigningEmail = !this.notifSetting.assigningEmail; break;
      case 2: this.notifSetting.opportunityEmail = !this.notifSetting.opportunityEmail; break;
      case 3: this.notifSetting.reminderEmail = !this.notifSetting.reminderEmail; break;
    }

    if (this.notifSetting.partner.id === 0) {
      this.notifSetting.partner.id = this.currentConnectedUser.id;
      this.notificationService.setSetting(this.token, this.notifSetting).subscribe({
        next: (data) => {
          console.log(data);
          this.notifSetting = data;
        }
      });
    } else {
      console.log(this.notifSetting);

      this.notificationService.updateSetting(this.token, this.notifSetting).subscribe({
        next: (data) => {
          console.log(data);
          this.notifSetting = data;
        }
      });
    }
    this.currentConnectedUser.notificationSettings[0] = this.notifSetting;

    localStorage.setItem("currentConnectedUser", JSON.stringify(this.currentConnectedUser));
  }
}
