import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartnerDTO } from '../../interfaces/partner.model';
import { EnterpriseService } from '../../services/enterprise/enterprise.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnterpriseDTO } from '../../interfaces/enterprise.model';
import { PartnerService } from '../../services/partner/partner.service';

@Component({
  selector: 'app-partner-details-dialog',
  templateUrl: './partner-details-dialog.component.html',
  styleUrls: ['./partner-details-dialog.component.scss']
})
export class PartnerDetailsDialogComponent {
  partner!: PartnerDTO;
  token: string;
  enterprise!: EnterpriseDTO;

  constructor(public dialogRef: MatDialogRef<PartnerDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private enterpriseService: EnterpriseService,
    private partnerService: PartnerService,
    private authService: AuthService) {
      this.token = authService.isLogged()!;
    }

    ngOnInit() {
      this.partnerService.getPartnerById(this.dialogData.partner.id, this.token).subscribe({
        next: (data) => {
          this.partner = data;
        },
        error: (err) => {
          console.log(err);
        }
      })

      this.enterpriseService.getEntrepriseById(this.dialogData.partner.enterprise.id, this.token).subscribe({
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
