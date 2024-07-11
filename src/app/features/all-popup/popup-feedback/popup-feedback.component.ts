import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FeedbackService} from "../../services/feedback/feedback.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-popup-feedback',
  templateUrl: './popup-feedback.component.html',
  styleUrls: ['./popup-feedback.component.scss']
})
export class PopupFeedbackComponent {
  feedbackForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PopupFeedbackComponent>,
    private feedbackService: FeedbackService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService
) {
    this.feedbackForm = this.fb.group({
      projectFeedback: ['', Validators.required],
      projectExperience: [''],
      financialFeedback: ['']
    });
  }

  submitFeedback(): void {
    const feedback = {
      generalAppreciation: this.feedbackForm.get("projectFeedback")?.value,
      finances: this.feedbackForm.get("financialFeedback")?.value,
      comment: this.feedbackForm.get("projectExperience")?.value
    }
    this.feedbackService.addFeedback(this.data.token, feedback).subscribe({
      next: (data) => {
        this.close();
        this.translateService.get(['SUCCESS_ADD_FEEDBACK', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_ADD_FEEDBACK'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_ADD_FEEDBACK', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_ADD_FEEDBACK'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

  close(): void {
    this.dialogRef.close();
  }

}
