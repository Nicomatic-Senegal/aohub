import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryComponent, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  token: string;

  constructor(private route: Router, private authService: AuthService) {
    authService.loggedOut();
    this.token = authService.isLogged()!;
  }

  evenments = [
    ["../../../assets/img/plannification.svg", "Réunion de planification du projet XYZ", "/planification", "Réunion", "10:00 am"],
    ["../../../assets/img/figma.svg", "Figma UI UX Design", "/figma", "Validation", "15:30 am"]
  ];

  partners = [
    ["../../../assets/img/pp.svg", "Mame Diarra Gueye", "/p1", "diarra.gueye@gmail.com", "+33 06 98 37 38"],
    ["../../../assets/img/nicomatic.svg", "Xavier", "/figma", "xavier@gmail.com", "+33 06 98 37 38"]
  ];

  images: GalleryItem[] = [];

  ngOnInit() {
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
