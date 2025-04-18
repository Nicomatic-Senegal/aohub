import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
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
  roleTranslationMap: Record<string, string> = {
    'Responsable produit': 'ROLE_PRODUCT_MANAGER',
    'Commercial': 'ROLE_SALES',
    'Acheteur': 'ROLE_BUYER',
    'Négociateur': 'ROLE_NEGOTIATOR',
    'Designer': 'ROLE_DESIGNER',
    'Directeur': 'ROLE_DIRECTOR',
    'Autre': 'OTHER'
  };

  constructor(
    private toastr: ToastrService,
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private translateService: TranslateService
    ) {
    const language = localStorage.getItem("language");

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
        this.translateService.get(['ERROR_FETCHING_COMPANIES', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_COMPANIES'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });

    this.enterpriseService.getAllEmployeePost().subscribe({
      next: (data: EmployeePostDTO[]) => {
        this.listEmployeePost = data.map((item: EmployeePostDTO) => ({
          ...item,
          translatedTitle: this.roleTranslationMap[item.title] || item.title
        }));
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_FETCHING_ROLES', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_ROLES'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
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

    this.authService.register(this.user).subscribe({
      next: (data) => {
        this.translateService.get(['SUCCESS_RECEIVE_VALIDATION_MAIL', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_RECEIVE_VALIDATION_MAIL'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
        this.registerForm.reset();
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_REGISTRATION', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_REGISTRATION'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    digitOnly(event);
  }
}
