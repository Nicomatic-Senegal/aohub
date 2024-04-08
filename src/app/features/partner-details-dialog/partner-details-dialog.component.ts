import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartnerDTO } from '../interfaces/partner.model';

@Component({
  selector: 'app-partner-details-dialog',
  templateUrl: './partner-details-dialog.component.html',
  styleUrls: ['./partner-details-dialog.component.scss']
})
export class PartnerDetailsDialogComponent {
  partner!: PartnerDTO;
  constructor(public dialogRef: MatDialogRef<PartnerDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
      
    }

    ngOnInit() {
      this.partner = this.dialogData.partner;
      console.log(this.partner);
      
    }

    onClose() {
      this.dialogRef.close();
    }
}
