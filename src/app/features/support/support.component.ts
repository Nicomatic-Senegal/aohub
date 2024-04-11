import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  supportForm!: FormGroup;

  constructor(private toastr: ToastrService, private route: Router, private fb: FormBuilder, private authService: AuthService) {

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
    const email = 'amadoudiao72@gmail.com';
    const subject = this.supportForm.value.intitule;
    const body = this.supportForm.value.description;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.supportForm.reset();
  }
}
