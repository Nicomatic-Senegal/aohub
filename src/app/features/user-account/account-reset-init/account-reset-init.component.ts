import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { KeyAndPasswordVM } from '../../interfaces/key-and-password-vm.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { confirmedValidator } from '../../interfaces/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-reset-init',
  templateUrl: './account-reset-init.component.html',
  styleUrls: ['./account-reset-init.component.scss']
})
export class AccountResetInitComponent implements OnInit {
  key!: string;
  changePasswordForm!: FormGroup;
  token!: string;

  constructor(private translateService: TranslateService, private route:Router, private router: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) {
    const language = localStorage.getItem("language");
    if (language) {
      this.translateService.use(language);
    } else {
      this.translateService.use('fr');
    }
  }

  ngOnInit() {
    this.key = this.router.snapshot.queryParamMap.get('key')!;
    this.changePasswordForm = this.fb.group({
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

  incremente() {
    if (this.page < 4)
      this.page++;
  }

  onSubmit() {
    let kpVm: KeyAndPasswordVM = {
      key: this.key,
      newPassword: this.changePasswordForm.value.password
    };
    console.log(kpVm);

    this.authService.finishPasswordReset(kpVm).subscribe({
      next: (data) => {
        console.log(data);
        this.incremente()
      },
      error: (err) => {

      }
    });
  }

  decremente() {
    if (this.page > 0)
      this.page--;
  }

  toConnexion() {
    this.route.navigate(["/signin"]);
  }


}
