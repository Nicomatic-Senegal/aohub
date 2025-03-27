// app.component.ts
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'inhub-ui';
}

