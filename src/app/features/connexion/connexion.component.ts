import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginVM } from 'src/app/core/interfaces/login-vm.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  isPasswordVisible: boolean = false;
  user: LoginVM = new LoginVM();
  loginForm: FormGroup;
  token!: string;

  constructor(private toastr: ToastrService, private route: Router, private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
    });

  }

  getControl(controlName: string) {
    return this.loginForm.get(controlName);
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
    const formValue = this.loginForm.value;
    this.user.username = formValue.username;
    this.user.password = formValue.password;
    console.log(this.user);

    this.authService.authenticate(this.user).subscribe({
      next: (data) => {
        console.log(data);
        localStorage.setItem("token", data['id_token']);
        localStorage.setItem("login", this.user.username);
        this.route.navigate(["/setting"]);
      },
      error: (err) => {
        console.log(err);

        this.toastr.error(err.error.detail, "Error Authentication", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });

      }
    })
  }
}
