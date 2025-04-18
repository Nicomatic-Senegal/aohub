import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerService } from '../services/partner/partner.service';
import { PartnerDTO } from '../interfaces/partner.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PartnerDetailsDialogComponent } from '../dialog/partner-details-dialog/partner-details-dialog.component';
import { EnterpriseDetailsDialogComponent } from '../dialog/enterprise-details-dialog/enterprise-details-dialog.component';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { UserService } from '../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  token: string;
  fullName!: string;
  searchData: PartnerDTO[] = [];
  enterprises: EnterpriseDTO[] = [];
  language: string = 'fr';
  currentConnectedUser?: any;
  showProjectSubmissionButton: boolean = false; // ← NOUVELLE variable

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private route: Router,
    private authService: AuthService,
    private userService: UserService,
    private partnerService: PartnerService,
    private enterpriseService: EnterpriseService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {
    authService.loggedOut();
    this.token = authService.isLogged()!;
  }

  ngOnInit() {
    const language = localStorage.getItem('language');
    if (language) {
      this.language = language;
    }
    this.loadCurrentConnectedUser();
    this.loadAllEnterprises();

    // Vérifie si l'utilisateur est de type ROLE_ENTERPRISE
    this.showProjectSubmissionButton = this.authService.isEnterprise();
  }

  loadCurrentConnectedUser() {
    const userData = localStorage.getItem('currentConnectedUser');
    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);
      this.fullName =
        this.currentConnectedUser?.firstName +
        ' ' +
        this.currentConnectedUser?.lastName;
    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.currentConnectedUser = data;
          this.fullName =
            this.currentConnectedUser?.user?.firstName +
            ' ' +
            this.currentConnectedUser?.user?.lastName;
        },
        error: (err) => {
          console.log(err);
          this.translateService
            .get(['ERROR_RECEIVE_USER', 'ERROR_TITLE'])
            .subscribe((translations) => {
              this.toastr.error(
                translations['ERROR_RECEIVE_USER'],
                translations['ERROR_TITLE'],
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-right',
                }
              );
            });
        },
      });
    }
  }

  loadAllEnterprises() {
    this.enterpriseService.getAllEnterprises().subscribe({
      next: (data) => {
        this.enterprises = data.filter(
          (enterprise: any) => enterprise.name !== 'Autre'
        );
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.performSearch(this.searchInput.nativeElement.value);
        })
      )
      .subscribe();
  }

  performSearch(query: string) {
    this.searchData = [];
    if (query) {
      this.partnerService.searchPartner(this.token, query).subscribe({
        next: (data) => {
          this.searchData.push(data);
          this.searchData = this.searchData.flatMap((data) => data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  openPartnerDetailsDialog(partner: any) {
    this.dialog.open(PartnerDetailsDialogComponent, {
      hasBackdrop: true,
      data: { partner },
      panelClass: 'custom-dialog-container',
    });
  }

  openEnterpriseDetailsDialog(enterprise: any) {
    this.dialog.open(EnterpriseDetailsDialogComponent, {
      hasBackdrop: true,
      data: { enterprise },
      panelClass: 'custom-dialog-container',
    });
  }

  navigation(link: string) {
    this.route.navigate([link]);
  }

  onLanguageEvent(data: string) {
    this.language = data;
  }
}
