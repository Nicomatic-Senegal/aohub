import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  isPasswordVisible: boolean = false;
  isAlreadySignedUp: boolean = false;

  constructor(private route: Router) {}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  seConnecter() {
    this.route.navigate(["/signin"]);
  }
}
