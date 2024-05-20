import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PopupComponent } from 'src/app/features/all-popup/popup/popup.component';

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

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    public dialog: MatDialog) {
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
    let title = "Déconnexion";
    let description = "Êtes-vous sûr de vouloir vous deconnecter ?";

    title = localStorage.getItem('language') === 'en' ? 'Déconnexion' : 'Disconnect';
    description = localStorage.getItem('language') === 'en' ? 'Are you sure you want to logout ?' : 'Êtes-vous sûr de vouloir vous deconnecter ?';

    let route = "logout";

    this.dialog.open(PopupComponent, {
      hasBackdrop: true,
      data: {
        title, description, route
      },
      panelClass: 'custom-dialog-container'
    });
  }
}
