import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SupportService } from '../services/support/support.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  supportForm!: FormGroup;
  token: string;

  constructor(
    private toastr: ToastrService,
    private route: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private supportService: SupportService,
    private translateService: TranslateService
  ) {
      this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.supportForm = this.fb.group({
      intitule: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });

  }

  getControl(controlName: string) {
    return this.supportForm.get(controlName);
  }

  sendEmail() {
    const payload = {
      subject: this.supportForm.value.intitule,
      content: this.supportForm.value.description
    }
    this.supportService.sendMailToSupport(this.token, payload).subscribe({
      next: (data) => {
        this.translateService.get(['SUCCESS_SUBMIT_MESSAGE_SUPPORT', 'SUCCESS_TITLE']).subscribe(translations => {
          this.toastr.success(translations['SUCCESS_SUBMIT_MESSAGE_SUPPORT'], translations['SUCCESS_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_SUBMIT_MESSAGE_SUPPORT', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_SUBMIT_MESSAGE_SUPPORT'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

}
