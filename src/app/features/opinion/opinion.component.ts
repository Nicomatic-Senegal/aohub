import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SupportService } from '../services/support/support.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from '../interfaces/feedback.model';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.scss']
})
export class OpinionComponent {
  token: string;
  selectedStars = 1;
  description: string = '';
  feedback: Feedback = {
    mark: 0,
    comment: '',
    userEmail: ''
  };

  constructor(public dialogRef: MatDialogRef<OpinionComponent>,
    private authService: AuthService,
    private toastr: ToastrService,
    private supportService: SupportService,
    private translateService: TranslateService
  ) {
      this.token = authService.isLogged()!;
  }

  closeDialog() {
    this.dialogRef.close()
  }

  submit() {
    this.feedback.mark = this.selectedStars;
    this.feedback.comment = this.description;
    this.feedback.userEmail = sessionStorage.getItem("login") || "";

    this.supportService.createNote(this.token, this.feedback).subscribe({
      next: (data) => {
        this.translateService.get(['SUCCESS_SUBMIT_FEEDBACK', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_SUBMIT_FEEDBACK'], translations['SUCCESS_TITLE'], {
            timeOut: 4000,
            positionClass: 'toast-top-right',
          });
        });
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_SUBMIT_FEEDBACK', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_SUBMIT_FEEDBACK'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

  onRate(stars: number): void {
    this.selectedStars = stars;
  }

}
