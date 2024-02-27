import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BaseAppService } from '../../core/services/base-app/base-app.service';
import { ManagedUserVM } from 'src/app/core/interfaces/managed-user-vm.model';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  isPasswordVisible: boolean = false;
  isAlreadySignedUp: boolean = false;
  registerForm: FormGroup;

  constructor(private route: Router, private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]],
      enterpriseName: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  seConnecter() {
    this.route.navigate(["/signin"]);
  }

  register() {
    let user: ManagedUserVM = new ManagedUserVM();
    const formValue = this.registerForm.value;
    user.email = formValue.email;
    user.login = formValue.email;
    user.enterpriseName = formValue.enterpriseName;
    user.firstName = formValue.firstName;
    user.lastName = formValue.lastName;
    user.phoneNumber = formValue.phoneNumber;
    user.password = formValue.password;
    console.log(user);

    this.authService.register(user).subscribe({
      next: (data) => {
        console.log(data);

      }
    })
  }
}
