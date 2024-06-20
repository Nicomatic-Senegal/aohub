import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../services/project/project.service';
import { NotificationService } from '../services/notification-service/notification-service.service';
import { Notification } from '../interfaces/notification-dto.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  groupedNotifications: { [key: string]: Array<Notification> } = {};
  notifications: Array<Notification> = [];
  token: string;
  unreadNotif: number = 0;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
  }

  ngOnInit() {
    this.loadAllNotifications();
    this.nbNotifNotRead();
  }

  loadAllNotifications() {
    this.notificationService.allNotifications(this.token).subscribe({
      next: (data) => {
        console.log(data);
        this.notifications = data;
        this.groupNotificationsByDate();
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  groupNotificationsByDate() {
    this.notifications.forEach(notification => {
      const dateKey = this.isToday(new Date(notification.createdDate || "")) ? 'Aujourd\'hui' : this.formatDate(new Date(notification.createdDate || ""));
      if (!this.groupedNotifications[dateKey]) {
        this.groupedNotifications[dateKey] = [];
      }
      this.groupedNotifications[dateKey].push(notification);
    });
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.notificationService.markAllNotificationsAsRead(this.token).subscribe({
      next: (data) => {
        this.notifications = data;
        this.nbNotifNotRead();
        this.groupNotificationsByDate();
      }
    });
  }

  markAsRead(notification: Notification) {

    notification.read = true;
    this.notificationService.markNotificationAsRead(this.token, notification.id!).subscribe({
      next: (data) => {
        notification = data;
        this.nbNotifNotRead();
      }
    });
  }

  nbNotifNotRead() {
    this.notificationService.allUnreadNotifications(this.token).subscribe({
      next: (data) => {
        console.log(data);
        this.unreadNotif = data;
      }
    })
  }

}
