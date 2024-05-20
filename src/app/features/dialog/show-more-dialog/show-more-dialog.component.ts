import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-more-dialog',
  templateUrl: './show-more-dialog.component.html',
  styleUrls: ['./show-more-dialog.component.scss']
})
export class ShowMoreDialogComponent implements OnInit {
  title: string = "";
  description: string = "";

  constructor(public dialogRef: MatDialogRef<ShowMoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

    ngOnInit(): void {
      this.title = this.dialogData.title;
      this.description = this.dialogData.description;
        
    }

    closeDialog() {
      this.dialogRef.close();
    }
}
