import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerService } from '../services/partner/partner.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PartnerDetailsDialogComponent } from '../partner-details-dialog/partner-details-dialog.component';
import { EnterpriseDetailsDialogComponent } from '../enterprise-details-dialog/enterprise-details-dialog.component';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { UserService } from '../services/user/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  token: string;
  fullName!: string;
  searchData: PartnerDTO[] = [];
  enterprises: EnterpriseDTO[] = [];
  currentIndex: number = 0;
  language: string = 'fr';
  currentConnectedUser?: any;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private route: Router,
    private authService: AuthService,
    private userService: UserService,
    private partnerService: PartnerService,
    private enterpriseService: EnterpriseService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    authService.loggedOut();
    this.token = authService.isLogged()!;
  }

  ngOnInit() {
    this.loadCurrentConnectedUser();
    this.loadAllEnterprises();
  }

  loadCurrentConnectedUser() {
    const userData = localStorage.getItem("currentConnectedUser");
    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);
      this.fullName = this.currentConnectedUser?.firstName + " " + this.currentConnectedUser?.lastName;
      this.language = this.currentConnectedUser?.langKey;
    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.currentConnectedUser = data;
          this.fullName = this.currentConnectedUser?.user?.firstName + " " + this.currentConnectedUser?.user?.lastName;
          this.language = this.currentConnectedUser?.user?.langKey;
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-right-right',
         });
        }
      })
    }
  }

  loadAllEnterprises() {
    this.enterpriseService.getAllEnterprises().subscribe({
      next: (data) => {
        console.log(data);

        this.enterprises = data.filter((enterprise:any) => enterprise.name !== 'Autre');
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap((event:KeyboardEvent) => {
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
          this.searchData = this.searchData.flatMap(data => data);
          console.log(this.searchData);

        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  openPartnerDetailsDialog(partner: any) {
    this.dialog.open(PartnerDetailsDialogComponent, {
      hasBackdrop: true,
      data: {
        partner
      },
      panelClass: 'custom-dialog-container'
    })
  }

  openEnterpriseDetailsDialog(enterprise: any) {
    this.dialog.open(EnterpriseDetailsDialogComponent, {
      hasBackdrop: true,
      data: {
        enterprise
      },
      panelClass: 'custom-dialog-container'
    })
  }

  navigation(link: string) {
    this.route.navigate([link]);
  }

  onLanguageEvent(data: string) {
    console.log(data);

    this.language = data;
  }

}
