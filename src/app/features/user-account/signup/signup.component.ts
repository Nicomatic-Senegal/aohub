import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BaseAppService } from '../../../core/services/base-app/base-app.service';
import { ManagedUserVM } from 'src/app/core/interfaces/managed-user-vm.model';
import { EnterpriseService } from '../../services/enterprise/enterprise.service';
import { EnterpriseDTO } from '../../interfaces/enterprise.model';
import { confirmedValidator, digitOnly } from '../../interfaces/utils';
import { ToastrService } from 'ngx-toastr';
import { EmployeePostDTO } from '../../interfaces/employee.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inscription',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isAlreadySignedUp: boolean = false;
  registerForm!: FormGroup;
  listEnterprise: Array<EnterpriseDTO> = [];
  listEmployeePost: Array<EmployeePostDTO> = [];
  user: ManagedUserVM = new ManagedUserVM();
  token!: string;
  isConfirmPasswordVisible: boolean = false;

  constructor(
    private toastr: ToastrService,
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private translateService: TranslateService
    ) {
    const language = localStorage.getItem("language");
    console.log(language);

    if (language) {
      this.translateService.use(language);
    } else {
      this.translateService.use('fr');
    }
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      cpassword: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      enterpriseName: new FormControl(null, [Validators.required]),
    },
    {
      validator: confirmedValidator('password', 'cpassword'),
    });

    this.enterpriseService.getAllEnterprises().subscribe({
      next: (data) => {
        this.listEnterprise = data;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des entreprises", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });

    this.enterpriseService.getAllEmployeePost().subscribe({
      next: (data) => {
        this.listEmployeePost = data;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des roles", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  getControl(controlName: string) {
    return this.registerForm.get(controlName);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    console.log("here i am");
  }

  seConnecter() {
    this.route.navigate(["/signin"]);
  }

  register() {
    const formValue = this.registerForm.value;
    this.user.email = formValue.email;
    this.user.login = formValue.email;
    this.user.enterpriseName = formValue.enterpriseName;
    this.user.firstName = formValue.firstName;
    this.user.lastName = formValue.lastName;
    this.user.phoneNumber = formValue.phoneNumber;
    this.user.password = formValue.password;
    this.user.langKey = "fr";
    this.user.employeePostTitle = formValue.role;
    console.log(this.user);

    this.authService.register(this.user).subscribe({
      next: (data) => {
        this.toastr.success("Vous allez recevoir un mail de validation.", "Succés", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
        this.registerForm.reset();
        // this.seConnecter();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Error pendant l'inscription", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    digitOnly(event);
  }
}
