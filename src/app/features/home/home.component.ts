import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryComponent, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { AuthService } from 'src/app/core/services/auth/auth.service';


interface CarouselItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  token: string;

  carouselItems: any = [
    { title: 'Titre 1', description: 'Description 1' },
    { title: 'Titre 2', description: 'Description 2' },
    { title: 'Titre 3', description: 'Description 3' },
    { title: 'Titre 4', description: 'Description 4' }
  ];

  currentIndex: number = 0;

  constructor(private route: Router, private authService: AuthService) {
    authService.loggedOut();
    this.token = authService.isLogged()!;
  }


  carouselItems: CarouselItem[] = [
    {
      title: 'UN PARCOURS UNIQUE',
      description: 'Chaque projet est unique, chaque gestion est différente. Le seul point commun est la promesse : une solution adaptée et répondant à votre besoin',
    },
    {
      title: 'UN PROJET & UN CO-DEVELOPPEMENT',
      description: 'Chaque projet proposé est une occasion de soutenir le client. Il vient partager avec une équipe d’experts qui aura l’écoute nécessaire pour prendre le relai.',
    },
    {
      title: 'L’ENGAGEMENT DE TOUT UN RESEAU',
      description: 'IN’HUB  n’est pas l’initiative d’une entreprise seule. Elle est le résultat de l’engagement d’un groupement d’industriels se mettant au service de son développement.',
    },
    {
      title: 'DES EXPERTISES EPROUVEES',
      description: 'Des experts dans leur domaine depuis plus de 10 ans répondant aux exigences de différents secteurs industriels et couvrant toutes les normes industrielles en vigueur.',
    },
    {
      title: 'DES CANAUX DIVERS, UNE PLATEFORME UNIQUE',
      description: 'Chaque membre de la communauté IN’HUB est un interlocuteur privilégié pour vos projets. Chaque membre fera le lien avec la plateforme de gestion.',
    },
    {
      title: 'CONFIANCE & TRANSPARENCE',
      description: 'Celui qui sait, fait. Du début de projet jusqu’à la fin, vous serez en lien avec les équipes pertinentes pour chaque étape pour gagner le maximum de temps et de clarté',
    },
  ];
  currentIndex: number = 0;

  evenments = [
    ["../../../assets/img/plannification.svg", "Réunion de planification du projet XYZ", "/planification", "Réunion", "10:00 am"],
    ["../../../assets/img/figma.svg", "Figma UI UX Design", "/figma", "Validation", "15:30 am"]
  ];

  partners = [
    ["../../../assets/img/pp.svg", "Mame Diarra Gueye", "/p1", "diarra.gueye@gmail.com", "+33 06 98 37 38"],
    ["../../../assets/img/nicomatic.svg", "Xavier", "/figma", "xavier@gmail.com", "+33 06 98 37 38"]
  ];

  images: GalleryItem[] = [];

<<<<<<< HEAD
  ngOnInit(): void {
=======
  ngOnInit() {

    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
    }, 6000);

>>>>>>> 7348eb1 (caroussel texte)
    this.images = [
      new ImageItem({ src: '../../../assets/img/Slide Item — 1.svg', thumb: '../../../assets/img/Slide Item — 1.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 2.svg', thumb: '../../../assets/img/Slide Item — 2.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 3.svg', thumb: '../../../assets/img/Slide Item — 3.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 4.svg', thumb: '../../../assets/img/Slide Item — 4.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 5.svg', thumb: '../../../assets/img/Slide Item — 5.svg' }),
      // ... more items
    ];
  }

  navigation(link: string) {
    this.route.navigate([link]);
  }

}
