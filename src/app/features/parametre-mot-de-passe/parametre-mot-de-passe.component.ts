import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BaseAppService } from '../../core/services/base-app/base-app.service';
import { confirmedValidator } from '../interfaces/utils';

@Component({
  selector: 'app-parametre-mot-de-passe',
  templateUrl: './parametre-mot-de-passe.component.html',
  styleUrls: ['./parametre-mot-de-passe.component.scss']
})
export class ParametreMotDePasseComponent implements OnInit {
  token!: string;
  changePasswordForm!: FormGroup;

  constructor(private route: Router, private authService: AuthService, private fb: FormBuilder, private baseApp: BaseAppService){
    // authService.loggedOut();
    // authService.isLogged(this.token);
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPassword: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      cpassword: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
    },
    {
      validator: confirmedValidator('password', 'cpassword'),
    });
  }

  getControl(controlName: string) {
    return this.changePasswordForm.get(controlName);
  }

  page: number = 0;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  email!: string;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
