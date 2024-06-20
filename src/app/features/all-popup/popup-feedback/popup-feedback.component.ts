import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FeedbackService} from "../../services/feedback/feedback.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-popup-feedback',
  templateUrl: './popup-feedback.component.html',
  styleUrls: ['./popup-feedback.component.scss']
})
export class PopupFeedbackComponent {
  feedbackForm: FormGroup;
  projectExperiences: string[] = ['Excellent', 'Good', 'Average', 'Poor'];

  constructor(
    public dialogRef: MatDialogRef<PopupFeedbackComponent>,
    private feedbackService: FeedbackService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.feedbackForm = this.fb.group({
      projectFeedback: ['', Validators.required],
      projectExperience: [''],
      financialFeedback: ['']
    });
  }

  ngOnInit(): void {}

  submitFeedback(): void {
    const feedback = {
      generalAppreciation: this.feedbackForm.get("projectFeedback")?.value,
      finances: this.feedbackForm.get("financialFeedback")?.value,
      comment: this.feedbackForm.get("projectExperience")?.value
    }
    this.feedbackService.addFeedback(this.data.token, feedback).subscribe({
      next: (data) => {
        this.close();
        this.toastr.success("Feedback ajouté avec succès", "Succès", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "\"Une erreur s'est produite lors de l'ajout du feedback", {
          timeOut: 3000,
          positionClass: 'toast-right-right',
        });
      }
    })
  }

  close(): void {
    this.dialogRef.close();
  }

}
