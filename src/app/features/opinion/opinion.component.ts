import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SupportService } from '../services/support/support.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from '../interfaces/feedback.model';

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
    private supportService: SupportService) {
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
        //TODO: Discomment this
        // this.toastr.success("Merci pour votre notation ! Votre feedback a été enregistré avec succès", "Succés", {
        //   timeOut: 3000,
        //   positionClass: 'toast-right-center',
        // });
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur lors de la soumission de l'avis", {
          timeOut: 3000,
          positionClass: 'toast-right-right',
        });
      }
    })
  }

  onRate(stars: number): void {
    this.selectedStars = stars;
  }

}
