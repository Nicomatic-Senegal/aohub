import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerService } from '../services/partner/partner.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PartnerDetailsDialogComponent } from '../partner-details-dialog/partner-details-dialog.component';
import { EnterpriseDetailsDialogComponent } from '../enterprise-details-dialog/enterprise-details-dialog.component';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';

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
  language: string;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private route: Router,
    private authService: AuthService,
    private partnerService: PartnerService,
    private userService: UserService,
    private enterpriseService: EnterpriseService,
    private dialog: MatDialog
  ) {
    authService.loggedOut();
    this.token = authService.isLogged()!;
    this.language = localStorage.getItem("language")!;
    if (!this.language) {
      this.language = 'fr';
    }
  }

  ngOnInit() {
    this.userService.getUser(this.token).subscribe({
      next: (data: PartnerDTO) => {
        this.fullName = data.user.firstName + ' ' + data.user.lastName;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.loadAllEnterprises();
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
