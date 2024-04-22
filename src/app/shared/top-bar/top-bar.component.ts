import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input() title!: string;
  flagUrl: string = '../../../assets/flags/fr_flag.svg';

  @Output() languageEvent = new EventEmitter<string>();

  emitLanguageEvent(value: string) {
    this.languageEvent.emit(value);
  }

  constructor(private translate: TranslateService, private authService: AuthService) {
    authService.isLogged()!;
    const language = localStorage.getItem("language");
    if (language) {
      this.translate.use(language);
    } else {
      this.translate.use('fr');
    }
  }

  changeLanguage(value: string, flagUrl: string) {
    this.flagUrl = flagUrl;
    this.translate.use(value);
    localStorage.setItem('language', value);
    this.emitLanguageEvent(value);
  }

  logout() {
    this.authService.logOut();
  }
}
