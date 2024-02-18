import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  isPasswordVisible: boolean = false;

  constructor(private route: Router) {}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  motDePasseOublie() {
    this.route.navigate(["/forget-password"]);
  }

  seConnecter() {
    this.route.navigate(["/signup"]);
  }
}
