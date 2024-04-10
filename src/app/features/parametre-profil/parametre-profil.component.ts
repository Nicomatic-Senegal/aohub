import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { UserService } from '../services/user/user.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { EmployeePostDTO } from '../interfaces/employee.model';
import { PartnerProfileVM } from '../interfaces/partner-profile-vm.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parametre-profil',
  templateUrl: './parametre-profil.component.html',
  styleUrls: ['./parametre-profil.component.scss']
})
export class ParametreProfilComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isAlreadySignedUp: boolean = false;
  profilForm!: FormGroup;
  listEmployeePost: Array<EmployeePostDTO> = [];
  listEnterprise: Array<EnterpriseDTO> = [];
  userToUpdate: PartnerProfileVM = {
    id: 0,
    userLogin: '',
    userFirstName: '',
    userLastName: '',
    phoneNumber: '',
    imageBase64Content: '',
    enterpriseName: '',
    employeePostTitle: '',
    employeePostDescription: '',
    interestTopicLabels: []
  };
  user: PartnerDTO = {
    id: 0,
    phoneNumber: '',
    imageBase64Content: '',
    imageUrl: '',
    user: {
      id: 0,
      login: '',
      firstName: '',
      lastName: '',
      email: ''
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
  picture!: string;
  pictureToShow!: string;

  centreInteret = [
    "Plasturgie", "Sourcing", "Prototypist", "Assemblage", "Metallurgie", "Technicien", "Chef De Projet"
  ];

  constructor(
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private userService: UserService,
    private toastr: ToastrService,
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.profilForm = this.fb.group({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      image: new FormControl(null, [Validators.required]),
      enterpriseName: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      centreInteret: new FormControl(null, [Validators.required]),
    });

    this.login = localStorage.getItem("login")!;
    console.log(this.token);

    this.userService.getUser(this.token).subscribe({
      next: (data) => {
        this.user = data;
        console.log(this.user);

        this.profilForm.setValue({
          firstName: this.user.user.firstName,
          lastName: this.user.user.lastName,
          phoneNumber: this.user.phoneNumber,
          email: this.user.user.login,
          enterpriseName: this.user.enterprise.name,
          role: this.user.employeePost.title,
          centreInteret: this.user.interestTopics,
          image: this.user.imageBase64Content,
        });
      },
      error: (err) => {
        console.log(err);

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
    return this.profilForm.get(controlName);
  }

  resetForm() {
    window.location.reload();
  }

  submit() {
    const formValue = this.profilForm.value;
    this.userToUpdate.userLogin = formValue.email;
    this.userToUpdate.userFirstName = formValue.firstName;
    this.userToUpdate.userLastName = formValue.lastName;
    this.userToUpdate.phoneNumber = formValue.phoneNumber;
    this.userToUpdate.enterpriseName = formValue.enterpriseName;
    this.userToUpdate.employeePostTitle = formValue.role;
    this.userToUpdate.interestTopicLabels = formValue.centreInteret;
    this.userToUpdate.imageBase64Content = this.picture;

    console.log(this.userToUpdate);

    this.updateUser(this.userToUpdate);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      console.log(file);

      const base64String = reader.result as string;
      // console.log(base64String);
      // this.profilForm.get('image')?.setValue(file.name);
      this.pictureToShow = file.name;
      this.picture = base64String;
      console.log(this.picture);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onDeletePicture() {
    this.userToUpdate.userLogin = this.user.user.login;
    this.userToUpdate.userFirstName = this.user.user.firstName;
    this.userToUpdate.userLastName = this.user.user.lastName;
    this.userToUpdate.phoneNumber = this.user.phoneNumber;
    this.userToUpdate.enterpriseName = this.user.enterprise.name;
    this.userToUpdate.employeePostTitle = this.user.employeePost.title;
    this.userToUpdate.interestTopicLabels = this.user.interestTopics;
    this.userToUpdate.imageBase64Content = '';
    this.updateUser(this.userToUpdate);
    // let pic: PictureVm = {};
    // pic.id = this.user.id;
    // pic.imageBase64Content = '';
    // this.userService.deletePicture(this.token, pic).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     this.user = data;
    //     this.toastr.success("profil modifié avec succés.", "Succés", {
    //       timeOut: 3000,
    //       positionClass: 'toast-top-center',
    //    });
    //    window.location.reload();
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.toastr.error("une erreur est survenue lors de la modification du profil.", "Erreur", {
    //       timeOut: 3000,
    //       positionClass: 'toast-top-center',
    //    });
    //   }
    // });
  }

  updateUser(userToUpdate: any) {
    this.userService.updateUser(this.token, userToUpdate).subscribe({
      next: (data) => {
        console.log(data);
        this.user = data;
        this.toastr.success("profil modifié avec succés.", "Succés", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
       window.location.reload();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("une erreur est survenue lors de la modification du profil.", "Erreur", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

}
