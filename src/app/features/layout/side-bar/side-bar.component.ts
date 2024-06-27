import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { PartnerDTO } from '../../interfaces/partner.model';
import { OpinionComponent } from '../../opinion/opinion.component';
import { MatDialog } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {NotificationService} from "../../services/notification-service/notification-service.service";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  screenSize: string = "sm";
  optionsTop = [
    ["../../../assets/img/home.svg", "HOME", "/home", "../../../assets/img/home-red.svg"],
    ["../../../assets/img/projects.svg", "MY PROJECTS", "/projects", "../../../assets/img/projects-red.svg"],
    ["../../../assets/img/opportunity.svg", "OPPORTUNITIES", "/opportunities", "../../../assets/img/opportunity-red.svg"],
    ["../../../assets/img/activity.svg", "ACTIVITY", "/activity", "../../../assets/img/activity-red.svg"],
    ["../../../assets/img/notification.svg", "NOTIFICATIONS", "/notifications", "../../../assets/img/notification-red.svg"]
  ];

  optionsBottom = [
    ["../../../assets/img/star.svg", "OPINION", "OPINION", "../../../assets/img/star-red.svg"],
    ["../../../assets/img/support.svg", "SUPPORT", "/support", "../../../assets/img/support-red.svg"],
    ["../../../assets/img/setting.svg", "SETTINGS", "/setting", "../../../assets/img/setting-red.svg"]
  ];
  viewText: boolean = true;
  token: string;
  fullName!: string;
  email!: string;
  picture!: string;
  @Input() screen!: string;
  unreadNotificationCount: number = 0;

  onHamburger() {
    this.viewText = !this.viewText;
  }

  constructor(private route: Router,
              private authService: AuthService,
              private userService: UserService,
              public dialog: MatDialog,
              private toastr: ToastrService,
              private notificationService: NotificationService) {
    authService.loggedOut();
    this.token = authService.isLogged()!;

    this.updateScreenSize(window.innerWidth);
  }
  ngOnInit(): void {
    this.nbNotificationsNotRead();
    const userData = localStorage.getItem("currentConnectedUser");
    if (userData) {
      const currentConnectedUser = JSON.parse(userData);
      this.fullName = currentConnectedUser?.firstName + " " + currentConnectedUser?.lastName;
      this.email = currentConnectedUser?.email;
      this.picture = currentConnectedUser?.imageBase64Content;
    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.fullName = data?.user?.firstName + " " + data?.user?.lastName;
          this.email = data?.user?.email;
          this.picture = data?.user?.imageBase64Content;
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-right-right',
          });
        }
      })
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenSize(event.target.innerWidth);
  }

  private updateScreenSize(width: number): void {
    if (width >= 1200) {
      this.screenSize = 'lg';
    } else if (width >= 992) {
      this.screenSize = 'md';
    } else {
      this.screenSize = 'sm';
    }
  }

  navigation(link: string) {
    if (link === 'OPINION') {
      this.dialog.open(OpinionComponent, {
        hasBackdrop: true,
        data: {
        },
        panelClass: 'custom-dialog-container'
      })
      return;
    }

    this.route.navigate([link]);
  }

  nbNotificationsNotRead() {
    this.notificationService.allUnreadNotifications(this.token).subscribe({
      next: (data) => {
        this.unreadNotificationCount = data;
      }
    })
  }
}
