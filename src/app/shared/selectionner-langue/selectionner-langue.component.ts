import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-selectionner-langue',
  templateUrl: './selectionner-langue.component.html',
  styleUrls: ['./selectionner-langue.component.scss']
})
export class SelectionnerLangueComponent {
  constructor(private translate: TranslateService,) {

  }

  changeLanguage(value: string) {
    console.log(value);

    this.translate.use(value);
    localStorage.setItem('language', value);
  }
}
