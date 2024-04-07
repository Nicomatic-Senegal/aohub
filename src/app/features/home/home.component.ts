import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerService } from '../services/partner/partner.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';


interface CarouselItem {
  title: string;
  description: string;
  color: string;
  background: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  token: string;
  searchData: PartnerDTO[] = [];
  currentIndex: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(private route: Router, private authService: AuthService, private partnerService: PartnerService) {
    authService.loggedOut();
    this.token = authService.isLogged()!;
  }


  carouselItems: CarouselItem[] = [
    {
      title: 'UN PARCOURS UNIQUE',
      description: 'Chaque projet est unique, chaque gestion est différente. Le seul point commun est la promesse : une solution adaptée et répondant à votre besoin',
      color: '#000000',
      background: 'FFFFFF'
    },
    {
      title: 'UN PROJET & UN CO-DEVELOPPEMENT',
      description: 'Chaque projet proposé est une occasion de soutenir le client. Il vient partager avec une équipe d’experts qui aura l’écoute nécessaire pour prendre le relai.',
      color: '#FFFFFF',
      background: '408A7E'
    },
    {
      title: 'L’ENGAGEMENT DE TOUT UN RESEAU',
      description: 'IN’HUB  n’est pas l’initiative d’une entreprise seule. Elle est le résultat de l’engagement d’un groupement d’industriels se mettant au service de son développement.',
      color: '#000000',
      background: 'FFFFFF'
    },
    {
      title: 'DES EXPERTISES EPROUVEES',
      description: 'Des experts dans leur domaine depuis plus de 10 ans répondant aux exigences de différents secteurs industriels et couvrant toutes les normes industrielles en vigueur.',
      color: '#FFFFFF',
      background: '408A7E'
    },
    {
      title: 'DES CANAUX DIVERS, UNE PLATEFORME UNIQUE',
      description: 'Chaque membre de la communauté IN’HUB est un interlocuteur privilégié pour vos projets. Chaque membre fera le lien avec la plateforme de gestion.',
      color: '#000000',
      background: 'FFFFFF'
    },
    {
      title: 'CONFIANCE & TRANSPARENCE',
      description: 'Celui qui sait, fait. Du début de projet jusqu’à la fin, vous serez en lien avec les équipes pertinentes pour chaque étape pour gagner le maximum de temps et de clarté',
      color: '#FFFFFF',
      background: '408A7E'
    },
  ];

  images: GalleryItem[] = [];

  ngOnInit() {
    this.images = [
      new ImageItem({ src: '../../../assets/img/Slide Item — 1.svg', thumb: '../../../assets/img/Slide Item — 1.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 2.svg', thumb: '../../../assets/img/Slide Item — 2.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 3.svg', thumb: '../../../assets/img/Slide Item — 3.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 4.svg', thumb: '../../../assets/img/Slide Item — 4.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 5.svg', thumb: '../../../assets/img/Slide Item — 5.svg' }),
    ];
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap((event:KeyboardEvent) => {
            console.log(event)
            console.log(this.searchInput.nativeElement.value)
            this.performSearch(this.searchInput.nativeElement.value);
          })
      )
      .subscribe();
  }

  performSearch(query: string) {
    this.searchData = [];
    if (query) {
      this.partnerService.searchPartner(this.token, query).subscribe({
        next: (data) => {
          this.searchData.push(data);
          this.searchData = this.searchData.flatMap(data => data);
          console.log(this.searchData);
          
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  navigation(link: string) {
    this.route.navigate([link]);
  }

}
