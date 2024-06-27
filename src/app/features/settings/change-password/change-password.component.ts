import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BaseAppService } from '../../../core/services/base-app/base-app.service';
import { confirmedValidator } from '../../interfaces/utils';
import { UserService } from '../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordChangeDTO } from '../../interfaces/password-dto.model';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-parametre-mot-de-passe',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  token!: string;
  changePasswordForm!: FormGroup;
  page: number = 0;
  isOldPasswordVisible: boolean = false;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  email!: string;
  passwordDto: PasswordChangeDTO ={
    currentPassword: '',
    newPassword: ''
  };

  constructor(private toastr: ToastrService, private route: Router, private userService: UserService, private authService: AuthService, private fb: FormBuilder, private baseApp: BaseAppService, private translateService: TranslateService){
    authService.loggedOut();
    this.token = authService.isLogged()!;
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

  toggleOldPasswordVisibility(): void {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  onSubmit() {
    this.passwordDto.currentPassword = this.changePasswordForm.value.oldPassword;
    this.passwordDto.newPassword = this.changePasswordForm.value.password;
    this.userService.changePassword(this.token,this.passwordDto ).subscribe({
      next: (data) => {
        this.translateService.get(['SUCCESS_UPDATE_PASSWORD', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_UPDATE_PASSWORD'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
       this.changePasswordForm.reset();
      },
      error: (err) => {
        this.translateService.get(['ERROR_UPDATE_PASSWORD', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_UPDATE_PASSWORD'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

  onReset() {
    this.changePasswordForm.reset();
  }
}
