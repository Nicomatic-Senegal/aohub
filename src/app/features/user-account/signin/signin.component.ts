import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoginVM } from 'src/app/core/interfaces/login-vm.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  isPasswordVisible: boolean = false;
  user: LoginVM = new LoginVM();
  loginForm: FormGroup;
  token!: string;

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private route: Router,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    const language = localStorage.getItem("language");
    if (language) {
      this.translate.use(language);
    } else {
      this.translate.use('fr');
    }
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

    this.authService.authenticate(this.user).subscribe({
      next: (data) => {
        localStorage.setItem("token", data['id_token']);
        localStorage.setItem("login", this.user.username);
        this.route.navigate(["/home"]);

        this.userService.getUser(data['id_token']).subscribe({
          next: (data) => {
            const userSessionData = {
              id: data.id,
              firstName: data?.user?.firstName,
              lastName: data?.user?.lastName,
              email: data?.user?.login,
              phoneNumber: data?.phoneNumber,
              langKey: data?.user?.langKey,
              imageBase64Content: data?.imageBase64Content,
              notificationSettings: data?.notificationSettings,
              enterprise: data?.enterprise
            };
            localStorage.setItem("currentConnectedUser", JSON.stringify(userSessionData));
          },
          error: (err) => {
            console.log(err);
            this.toastr.error(err.error.detail, "Une erreur est survenue lors de la réception de l'utilisateur connecté", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
           });
          }
        })
      },
      error: (err) => {
        console.log(err);

        this.toastr.error(err.error.detail, "Une erreur est survenue lors de la connexion", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });

      }
    })
  }
}
