import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, timer, takeUntil, switchMap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-mot-de-passe-oublie-processus',
  templateUrl: './mot-de-passe-oublie-processus.component.html',
  styleUrls: ['./mot-de-passe-oublie-processus.component.scss']
})
export class MotDePasseOublieProcessusComponent {
  page: number = 0;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  email!: string;
  mailFrom!: FormGroup;
  token!: string;

  constructor(private toastr: ToastrService, private route: Router, private authService: AuthService, private fb: FormBuilder){

  }

  seconds: number = 0;
  private unsubscribe$ = new Subject<void>();
  private buttonDisabled: boolean = true;

  ngOnInit(): void {
    this.startTimer();
    this.mailFrom = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  getControl(controlName: string) {
    return this.mailFrom.get(controlName);
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
    console.log(this.email);

    this.authService.requestPasswordReset(this.email).subscribe({
      next: (data) => {
        this.incremente();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur pendant l'envoie du mail", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
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
