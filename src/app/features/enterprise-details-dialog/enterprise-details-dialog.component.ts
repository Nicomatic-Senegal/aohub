import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { EnterpriseService } from '../services/enterprise/enterprise.service';

@Component({
  selector: 'app-enterprise-details-dialog',
  templateUrl: './enterprise-details-dialog.component.html',
  styleUrls: ['./enterprise-details-dialog.component.scss']
})
export class EnterpriseDetailsDialogComponent implements OnInit {
  enterpriseId!: EnterpriseDTO;
  enterprise!: EnterpriseDTO;
  constructor(public dialogRef: MatDialogRef<EnterpriseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any, private enterpriseService: EnterpriseService) {
      
    }

    ngOnInit() {
      this.enterpriseId = this.dialogData.enterprise;
      this.enterpriseService.getEntrepriseById(this.enterpriseId).subscribe({
        next: (data) => {
          console.log(data);
          
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
