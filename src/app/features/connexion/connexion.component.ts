import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginVM } from 'src/app/core/interfaces/login-vm.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  isPasswordVisible: boolean = false;
  loginForm: FormGroup;

  constructor(private route: Router, private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  motDePasseOublie() {
    this.route.navigate(["/forget-password"]);
  }

  inscription() {
    this.route.navigate(["/signup"]);
  }

  login() {
    let user: LoginVM = new LoginVM();
    const formValue = this.loginForm.value;
    user.username = formValue.username;
    user.password = formValue.password;
    console.log(user);

    this.authService.authenticate(user).subscribe({
      next: (data) => {
        console.log(data);

      }
    })
  }
}
