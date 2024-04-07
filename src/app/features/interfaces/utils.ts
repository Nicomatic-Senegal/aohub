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

export function base64toFile(base64String: string, fileName: string): File {
  // Obtenez le type MIME à partir du contenu base64
  const mimeType = getMimeTypeFromBase64(base64String);
  // Créez un Blob à partir du contenu base64 avec le type MIME déduit
  const blob = base64ToBlob(base64String, mimeType);
  // Créez un objet File avec le Blob et le nom de fichier
  return new File([blob], fileName, { type: mimeType });
}

// Function to get MIME type from base64 content
function getMimeTypeFromBase64(base64String: string): string {
  const marker = ';base64,';
  const parts = base64String.split(marker);
  if (parts.length !== 2) {
      throw new Error('Invalid base64 string');
  }
  const contentType = parts[0].split(':')[1];
  return contentType;
}

// Function to convert base64 to Blob
function base64ToBlob(base64String: string, mimeType: string): Blob {
  const byteCharacters = atob(base64String);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: mimeType });
}
