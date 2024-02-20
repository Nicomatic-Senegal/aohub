import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mot-de-passe-oublie-processus',
  templateUrl: './mot-de-passe-oublie-processus.component.html',
  styleUrls: ['./mot-de-passe-oublie-processus.component.scss']
})
export class MotDePasseOublieProcessusComponent {
  page: number = 0;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(private route: Router){}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  incremente() {
    if (this.page < 4)
      this.page++;
  }

  decremente() {
    if (this.page > 0)
      this.page--;
  }

  toConnexion() {
    this.route.navigate(["/signin"]);
  }
}
