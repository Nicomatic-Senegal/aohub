import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-enterprise-details-dialog',
  templateUrl: './enterprise-details-dialog.component.html',
  styleUrls: ['./enterprise-details-dialog.component.scss']
})
export class EnterpriseDetailsDialogComponent implements OnInit {
  enterpriseId!: EnterpriseDTO;
  enterprise!: EnterpriseDTO;
  imageUrl!: string;
  token: string;

  constructor(
    public dialogRef: MatDialogRef<EnterpriseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any, 
    private enterpriseService: EnterpriseService,
    private authService: AuthService) {
      this.token = authService.isLogged()!;
    }

    ngOnInit() {
      this.enterpriseId = this.dialogData.enterpriseId;
      this.imageUrl = this.dialogData.imageUrl;

      this.enterpriseService.getEntrepriseById(this.enterpriseId, this.token).subscribe({
        next: (data) => {
          this.enterprise = data;
        },
        error: (err) => {
          console.log(err);
        }
      })
    }

    onClose() {
      this.dialogRef.close();
    }
}
