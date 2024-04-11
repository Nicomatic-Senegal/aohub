import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input() title!: string;

  constructor(private authService: AuthService) {

  }

  logout() {
    this.authService.logOut();
  }
}
