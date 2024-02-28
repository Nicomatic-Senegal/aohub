import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagedUserVM } from 'src/app/core/interfaces/managed-user-vm.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { UserService } from '../services/user/user.service';
import { PartnerDTO } from '../interfaces/partner.model';

@Component({
  selector: 'app-parametre-profil',
  templateUrl: './parametre-profil.component.html',
  styleUrls: ['./parametre-profil.component.scss']
})
export class ParametreProfilComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isAlreadySignedUp: boolean = false;
  registerForm!: FormGroup;
  listEnterprise: Array<EnterpriseDTO> = [];
  user!: PartnerDTO;
  token!: string;
  login!: string;

  constructor(
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private userService: UserService
    ) {
      if (!localStorage.getItem("token")) {
        this.route.navigate(['/signin']);
        return;
      }
      const item = localStorage.getItem("token");
      if (typeof item == "string") {
        this.token = item;
      }
  }

  ngOnInit(): void {
    this.login = localStorage.getItem("login")!;
    this.userService.getUser(this.token).subscribe({
      next: (data) => {
        console.log(data);
        this.user = data;
      },
      error: (err) => {

      }
    })
    this.registerForm = this.fb.group({
      // firstName: new FormControl(this.user.firstName, [Validators.required]),
      // lastName: new FormControl(this.user.lastName, [Validators.required]),
      // phoneNumber: new FormControl(this.user.phoneNumber, [Validators.required]),
      // email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      // password: new FormControl(this.user.password, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      // enterpriseName: new FormControl(this.user.enterpriseName, [Validators.required]),
    });

    this.enterpriseService.getAllEnterprises().subscribe({
      next: (data) => {
        this.listEnterprise = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getControl(controlName: string) {
    return this.registerForm.get(controlName);
  }
}
