import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  screenSize!: string;
  options = [
    ["../../../assets/img/home.svg", "Accueil", "/accueil"],
    ["../../../assets/img/projects.svg", "Mes projets", "/projets"],
    ["../../../assets/img/opportunity.svg", "Opportinutés", "/opportinutes"],
    ["../../../assets/img/activity.svg", "Activité", "/activite"],
    ["../../../assets/img/notification.svg", "Notification", "/notification"]
  ]

  constructor(private route: Router) {
    // Initialisez la taille de l'écran lors du chargement de la page
    this.updateScreenSize(window.innerWidth);
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
