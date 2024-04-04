import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-apply-project-dialog',
  templateUrl: './apply-project-dialog.component.html',
  styleUrls: ['./apply-project-dialog.component.scss']
})
export class ApplyProjectDialogComponent {
  creneaux: any = null;

  constructor(
  ) {
  }

  ngOnInit() {
    this.creneaux = [
      {
        "day": "Lundi",
        "date": "16/03/2024",
        "hour": "10h30mn"
      },
      {
        "day": "Mardi",
        "date": "17/03/2024",
        "hour": "09h00mn"
      },
      {
        "day": "Mercredi",
        "date": "86/03/2024",
        "hour": "10h30mn"
      },
    ]
  }
}
