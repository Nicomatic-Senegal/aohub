import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnterpriseDTO } from '../../interfaces/enterprise.model';
import { EnterpriseService } from '../../services/enterprise/enterprise.service';
import { UserService } from '../../services/user/user.service';
import { PartnerDTO } from '../../interfaces/partner.model';
import { EmployeePostDTO } from '../../interfaces/employee.model';
import { PartnerProfileVM } from '../../interfaces/partner-profile-vm.model';
import { ToastrService } from 'ngx-toastr';
import {NgxImageCompressService} from "ngx-image-compress";
import {PopupComponent} from "../../all-popup/popup/popup.component";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-parametre-profil',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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

  constructor(
    private route: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private userService: UserService,
    private toastr: ToastrService,
    private imgCompressService: NgxImageCompressService,
    public dialog: MatDialog,
    private translateService: TranslateService
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

    this.userService.getUser(this.token).subscribe({
      next: (data) => {
        this.user = data;

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
        this.translateService.get(['ERROR_RECEIVE_USER', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_RECEIVE_USER'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });

    this.enterpriseService.getAllEmployeePost().subscribe({
      next: (data) => {
        this.listEmployeePost = data;
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
    if (!this.picture)
      this.userToUpdate.imageBase64Content = this.user.imageBase64Content;

    this.updateUser(this.userToUpdate);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgCompressService
          .compressFile(event.target.result, -1, 50, 50)
          .then(result => {
            this.picture = result;
            var sizeOfCompressedImage = 0;
            sizeOfCompressedImage = this.imgCompressService.byteCount(result)/(1024*1024);
            if (sizeOfCompressedImage > 2) {
              this.picture = '';
              this.translateService.get(['ERROR_IMAGE_TO_BIG', 'ERROR_TITLE']).subscribe(translations => {
                this.toastr.error(translations['ERROR_IMAGE_TO_BIG'], translations['ERROR_TITLE'], {
                  timeOut: 3000,
                  positionClass: 'toast-top-right',
                });
              });
            }
            this.submit();
          });
      }

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  onDeletePicture() {
    let title = localStorage.getItem('language') === 'en' ? 'Delete' : 'Suppression';
    let description = localStorage.getItem('language') === 'en' ? 'Are you sure you want to delete your profile picture ?' : 'Êtes-vous sûr de vouloir supprimer votre photo de profil ?';

    let route = "deleteProfilePicture";

    const dialogRef = this.dialog.open(PopupComponent, {
      hasBackdrop: true,
      data: {
        title, description, route
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.componentInstance.profilePictureRemovedEvent.subscribe((status) => {
      this.userToUpdate.userLogin = this.user.user.login;
      this.userToUpdate.userFirstName = this.user.user.firstName;
      this.userToUpdate.userLastName = this.user.user.lastName;
      this.userToUpdate.phoneNumber = this.user.phoneNumber;
      this.userToUpdate.enterpriseName = this.user.enterprise.name;
      this.userToUpdate.employeePostTitle = this.user.employeePost.title;
      this.userToUpdate.interestTopicLabels = this.user.interestTopics;
      this.userToUpdate.imageBase64Content = '';
      this.updateUser(this.userToUpdate);
    });
  }

  updateUser(userToUpdate: any) {
    this.userService.updateUser(this.token, userToUpdate).subscribe({
      next: (data) => {
        this.user = data;
        this.translateService.get(['SUCCESS_UPDATE_PROFILE', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['SUCCESS_UPDATE_PROFILE'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });

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

        this.profilForm.setValue({
          firstName: data?.user?.firstName,
          lastName: data?.user?.lastName,
          phoneNumber: data?.phoneNumber,
          email: data?.user?.login,
          enterpriseName: data?.enterprise?.name,
          role: data?.user.employeePost?.title,
          centreInteret: data?.user?.interestTopics,
          image: data?.user?.imageBase64Content,
        });
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_UPDATE_PROFILE', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_UPDATE_PROFILE'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

}
