import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {

  }

  ngOnInit(): void {
  }

  onLogout() {
    this.onCloseDialog();
    this.authService.logOut();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
