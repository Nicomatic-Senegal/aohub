import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnterpriseDTO } from '../../interfaces/enterprise.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-enterprise-details-dialog',
  templateUrl: './enterprise-details-dialog.component.html',
  styleUrls: ['./enterprise-details-dialog.component.scss']
})
export class EnterpriseDetailsDialogComponent implements OnInit {
  enterprise!: EnterpriseDTO;
  token: string;

  constructor(
    public dialogRef: MatDialogRef<EnterpriseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private authService: AuthService) {
      this.token = authService.isLogged()!;
    }

    ngOnInit() {
      this.enterprise = this.dialogData.enterprise;
    }

    onClose() {
      this.dialogRef.close();
    }
}
