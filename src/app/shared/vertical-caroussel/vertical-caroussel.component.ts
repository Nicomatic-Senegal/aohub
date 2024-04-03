import { Component } from '@angular/core';
import * as $ from "jquery";
import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-vertical-caroussel',
  templateUrl: './vertical-caroussel.component.html',
  styleUrls: ['./vertical-caroussel.component.scss']
})
export class VerticalCarousselComponent {

  images: GalleryItem[] = [];
  ngOnInit() {
    this.images = [
      new ImageItem({ src: '../../../assets/img/Slide Item — 1.svg', thumb: 'kjkjjjlk' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 2.svg', thumb: '../../../assets/img/Slide Item — 2.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 3.svg', thumb: '../../../assets/img/Slide Item — 3.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 4.svg', thumb: '../../../assets/img/Slide Item — 4.svg' }),
      new ImageItem({ src: '../../../assets/img/Slide Item — 5.svg', thumb: '../../../assets/img/Slide Item — 5.svg' }),
      // ... more items
    ];
  }
}
