import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'inhub-ui';
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: true,
        imageSize: 'cover'
      } as GalleryConfig
    }
  ]
})
