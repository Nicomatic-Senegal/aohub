import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PreSalesComponent } from '../../dialog/pre-sales/pre-sales.component';

@Component({
  selector: 'app-project-tracking',
  templateUrl: './project-tracking.component.html',
  styleUrls: ['./project-tracking.component.scss']
})
export class ProjectTrackingComponent {
  token: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
  }

  openPreSalesDialog() {
    this.dialog.open(PreSalesComponent, {
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    })
  }

  openInitDialog() {
    this.dialog.open(PreSalesComponent, {
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    })
  }

  openFeasabilityDialog() {
    this.dialog.open(PreSalesComponent, {
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    })
  }

  openIndustrializationDialog() {
    this.dialog.open(PreSalesComponent, {
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    })
  }

  openProdDeploymentDialog() {
    this.dialog.open(PreSalesComponent, {
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    })
  }

  openStudyDialog() {
    this.dialog.open(PreSalesComponent, {
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    })
  }
}
