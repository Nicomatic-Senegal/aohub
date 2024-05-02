import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { ToastrService } from 'ngx-toastr';

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
    // ["../../../assets/img/activity.svg", "Activités", "/activite", "../../../assets/img/activity-red.svg"],
    // ["../../../assets/img/notification.svg", "Notifications", "/notification", "../../../assets/img/notification-red.svg"]
  ];

  optionsBottom = [
    // ["../../../assets/img/star.svg", "Avis", "/avis", "../../../assets/img/star-red.svg"],
    ["../../../assets/img/support.svg", "SUPPORT", "/support", "../../../assets/img/support-red.svg"],
    ["../../../assets/img/setting.svg", "SETTINGS", "/setting", "../../../assets/img/setting-red.svg"]
  ];
  viewText: boolean = true;
  token: string;
  fullName!: string;
  email!: string;
  picture!: string;
  currentConnectedUser?: any;
  @Input() screen!: string;

  onHamburger() {
    this.viewText = !this.viewText;
  }

  constructor(private route: Router, private authService: AuthService, private userService: UserService, private toastr: ToastrService,) {
    // Initialisez la taille de l'écran lors du chargement de la page
    console.log(window.innerWidth);
    authService.loggedOut();
    this.token = authService.isLogged()!;

    this.updateScreenSize(window.innerWidth);
  }
  ngOnInit(): void {
    this.loadCurrentConnectedUser();

  }

  loadCurrentConnectedUser() {
    const userData = localStorage.getItem("currentConnectedUser");
    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);
      this.fullName =this.currentConnectedUser?.firstName + " " + this.currentConnectedUser?.lastName;
      this.email = this.currentConnectedUser?.email;
      this.picture = this.currentConnectedUser?.imageBase64Content;
    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.currentConnectedUser = data;    
          this.fullName = this.currentConnectedUser?.user?.firstName + " " + this.currentConnectedUser?.user?.lastName;
          this.email = this.currentConnectedUser?.user?.login;
          this.picture = this.currentConnectedUser?.imageBase64Content;    
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-right-center',
         });
        }
      })
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Mettez à jour la taille de l'écran lors du redimensionnement de la fenêtre
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

  humburger() {

  }

  navigation(link: string) {
    this.route.navigate([link]);
  }
}
