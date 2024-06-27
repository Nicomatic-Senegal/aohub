import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, timer, takeUntil, switchMap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';


@Component({
  selector: 'app-mot-de-passe-oublie-processus',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  page: number = 0;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  email!: string;
  mailForm!: FormGroup;
  token!: string;

  constructor(private translateService: TranslateService,   private toastr: ToastrService, private route: Router, private authService: AuthService, private fb: FormBuilder){
    const language = localStorage.getItem("language");
    if (language) {
      this.translateService.use(language);
    } else {
      this.translateService.use('fr');
    }
  }


  seconds: number = 0;
  private unsubscribe$ = new Subject<void>();
  private buttonDisabled: boolean = true;

  ngOnInit(): void {
    this.startTimer();
    this.mailForm = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  getControl(controlName: string) {
    return this.mailForm.get(controlName);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  startTimer(): void {
    timer(0, 1000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.seconds++;
        if (this.seconds === 60) {
          // Activer le bouton après le premier cycle de 60 secondes
          this.buttonDisabled = false;
        }
      });
  }

  startTimerOnClick(): void {
    this.onSubmit(false);
    this.seconds = 0; // Réinitialisez le compteur à chaque clic
    this.buttonDisabled = true; // Désactivez le bouton dès le début du cycle
    timer(0, 1000)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => timer(60000)) // Désactivez le bouton pendant 60 secondes
      )
      .subscribe(() => {
        this.buttonDisabled = false; // Réactivez le bouton après 60 secondes
      });
  }

  isButtonDisabled(): boolean {
    return this.buttonDisabled;
  }

  incremente() {
    if (this.page < 1)
      this.page++;
  }

  onSubmit(incr: boolean) {
    console.log(this.mailForm.value);

    console.log(this.email);

    this.authService.requestPasswordReset(this.mailForm.value.email).subscribe({
      next: (data) => {
        this.incremente();
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_SENDING_MAIL', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_SENDING_MAIL'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    })
  }

  decremente() {
    if (this.page > 0)
      this.page--;
  }

  toConnexion() {
    this.route.navigate(["/signin"]);
  }


}
