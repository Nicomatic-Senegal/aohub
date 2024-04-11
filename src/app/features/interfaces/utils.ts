import { FormGroup } from "@angular/forms";
import { MatDateFormats } from "@angular/material/core";

export function confirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors['confirmedValidator']
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}



export function digitOnly(event: KeyboardEvent) {
  const allowedChars = /^[0-9]+$/; // Expression régulière pour n'accepter que des chiffres

  // Vérifier si la touche saisie est autorisée
  if (!allowedChars.test(event.key)) {
    event.preventDefault(); // Empêcher la saisie du caractère non autorisé
  }
}
