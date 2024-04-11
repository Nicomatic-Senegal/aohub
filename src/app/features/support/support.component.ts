import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SupportService } from '../services/support/support.service';

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
    private supportService: SupportService) {
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
      support: this.supportForm.value.intitule,
      content: this.supportForm.value.description
    }
    console.log(payload);
    
    this.supportService.sendMailToSupport(this.token, payload).subscribe({
      next: (data) => {
        console.log(data);
        this.toastr.success("Votre message a été bien envoyé à l'équipe support: ", "Succès", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur survenue lors de l'envoie du message à l'équipe support", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      }
    })
  }
  
}
