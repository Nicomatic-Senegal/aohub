import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.feedbackForm = this.fb.group({
      author: ['', Validators.required],
      projectFeedback: [''],
      projectExperience: ['', Validators.required],
      financialFeedback: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      this.dialogRef.close(this.feedbackForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
