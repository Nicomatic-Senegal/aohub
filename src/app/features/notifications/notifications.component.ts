import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../services/project/project.service';
import { NotificationService } from '../services/notification-service/notification-service.service';
import { Notification } from '../interfaces/notification-dto.model';
import {debounceTime, distinctUntilChanged, filter, fromEvent, tap} from "rxjs";

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
  searchData: Notification[] = [];
  totalItems = 0;
  itemPerPage = 40;
  currentPage = 1;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

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
    this.loadAllNotifications(this.currentPage - 1, this.itemPerPage);
    this.nbNotifNotRead();
  }

  loadAllNotifications(page: number, size: number) {
    this.notifications = [];
    this.notificationService.allNotifications(this.token, page, size).subscribe({
      next: (data) => {
        this.notifications = data.notifications;
        this.totalItems = data.totalCount;
        this.groupNotificationsByDate();
        console.log(this.notifications)
        console.log(this.totalItems)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  groupNotificationsByDate() {
    this.notifications.sort((a, b) => b.id! - a.id!);
    this.notifications.forEach(notification => {
      const dateKey = this.isToday(new Date(notification.createdDate || "")) ? 'Aujourd\'hui' : notification.createdDate;
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
        this.unreadNotif = data;
      }
    })
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement,'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap((event:KeyboardEvent) => {
          this.performSearch(this.searchInput.nativeElement.value);
        })
      )
      .subscribe();
  }

  performSearch(query: string) {
    if (query) {
      this.notificationService.searchNotifications(this.token, query, 0, 100).subscribe({
        next: (data) => {
          this.notifications = [];
          this.notifications.push(data.notifications);
          this.notifications = this.notifications.flatMap(data => data);
          this.totalItems = data.totalCount;
          this.groupNotificationsByDate();
          console.log(data);
          console.log(this.totalItems);
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.loadAllNotifications(0, 4);
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadAllNotifications(this.currentPage - 1, this.itemPerPage);
  }

}
