import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input() title!: string;

  constructor(private translate: TranslateService, private authService: AuthService) {

  }

  changeLanguage(value: string) {
    console.log(value);

    this.translate.setDefaultLang(value);
  }

  logout() {
    this.authService.logOut();
  }
}
