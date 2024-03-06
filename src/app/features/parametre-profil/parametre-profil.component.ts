import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagedUserVM } from 'src/app/core/interfaces/managed-user-vm.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { UserService } from '../services/user/user.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { BaseAppService } from 'src/app/core/services/base-app/base-app.service';
import { InterestTopicDTO } from '../interfaces/interest-topic.model';

@Component({
  selector: 'app-parametre-profil',
  templateUrl: './parametre-profil.component.html',
  styleUrls: ['./parametre-profil.component.scss']
})
export class ParametreProfilComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isAlreadySignedUp: boolean = false;
  profilForm!: FormGroup;
  listEnterprise: Array<EnterpriseDTO> = [];
  user: PartnerDTO = {
    id: 0,
    phoneNumber: '',
    imageBase64Content: '',
    imageUrl: '',
    user: {
      id: 0,
      login: '',
      firstName: '',
      lastName: ''
    },
    enterprise: {
      id: 0,
      name: '',
      phoneNumber: '',
      address: '',
      email: '',
      ninea: '',
      description: '',
      imageBase64Content: null,
      imageUrl: null
    },
    employeePost: {
      id: 0,
      title: '',
      description: ''
    },
    interestTopics: []
  };
  token!: string;
  login!: string;

  constructor(
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private userService: UserService,
    ) {
      // authService.loggedOut();
      // authService.isLogged(this.token);
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
    this.profilForm = this.fb.group({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      enterpriseName: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      centreInteret: new FormControl(null, [Validators.required]),
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
    return this.profilForm.get(controlName);
  }
}
