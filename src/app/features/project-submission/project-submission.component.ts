import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { format } from 'date-fns';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-project-submission',
  templateUrl: './project-submission.component.html',
  styleUrls: ['./project-submission.component.scss']
})
export class ProjectSubmissionComponent implements OnInit {

  step: number = 1;
  titleSteps = ["Modalités", "Pièces jointes", "Lancement", "Terminer"];
  stepsIcons = [
    ["../../../assets/img/modality.svg", "../../../assets/img/modality-green.svg"],
    ["../../../assets/img/description.svg", "../../../assets/img/description-green.svg"],
    ["../../../assets/img/date-time.svg", "../../../assets/img/date-time-green.svg"],
    ["../../../assets/img/success-grey.svg", "../../../assets/img/success-green.svg"]
  ];
  projectSubmissionForm: FormGroup;
  metiers = [
    "Plasturgie", "Sourcing", "Prototypist", "Assemblage", "Metallurgie", "Technicien", "Chef De Projet"
  ];

  heureDebutNumber!: number;
  minuteDebutNumber!: number;
  heureFinNumber!: number;
  minuteFinNumber!: number;
  minDateFinString!: string;
  startDateToString!: string;
  endDateToString!: string;
  token: string;
  selectedDate!: Date | null;
  allDateChoosen: Array<Date> = [];



  constructor(private fb: FormBuilder, private authService: AuthService) {
    authService.loggedOut();
    this.token = authService.isLogged()!;

    this.projectSubmissionForm = this.fb.group({
      intitule: new FormControl(null, [Validators.required]),
      client: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      metier: new FormControl(null, [Validators.required]),
      confidentialite1: new FormControl(true, [Validators.required]),
      confidentialite2: new FormControl(false, [Validators.required]),
      marche: new FormControl(null, [Validators.required]),
      prixCible: new FormControl(null, [Validators.required]),
      typeDeBesoin: new FormControl(null, [Validators.required]),
      duree: new FormControl(null, [Validators.required]),
      volumeGlobal: new FormControl(null, [Validators.required]),
      budget: new FormControl(null, [Validators.required]),
      // delaiPlusTot: new FormControl(null, [Validators.required]),
      // delaiPlusTard: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      heure: new FormControl(null, [Validators.required]),
      // heureFin: new FormControl(null, [Validators.required]),
    });

    const dayStart = new Date();
    const dayEnd = new Date();

    // Définissez l'heure, les minutes et les secondes à zéro
    dayStart.setHours(0, 0, 0, 0);
    dayEnd.setHours(23, 50, 0, 0);

    this.projectSubmissionForm.patchValue({
      startDate: format(dayStart, 'yyyy-MM-dd'),
      endDate: format(dayEnd, 'yyyy-MM-dd'),
      heureDebut: dayStart,
      heureFin: dayEnd,
    });

    // pour afficher uniquement les date posterieur
    this.minDateFinString = format(dayStart, 'yyyy-MM-dd')

  }

  ngOnInit(): void {
    // je recupere la date du debut
    const startDateControl: any = this.projectSubmissionForm.get('startDate');
    const endDateControl: any = this.projectSubmissionForm.get('endDate');
    const heureDebutControl: any = this.projectSubmissionForm.get('heureDebut');
    const heureFinControl: any = this.projectSubmissionForm.get('heureFin');
    endDateControl.valueChanges.subscribe((value: any) => {

      if (value) {
        const dateFin = new Date(value);
        this.heureFinNumber = this.projectSubmissionForm.value.heureFin.getHours();
        this.minuteFinNumber = this.projectSubmissionForm.value.heureFin.getMinutes();
        dateFin.setHours(this.heureFinNumber, this.minuteFinNumber);
        this.endDateToString = format(dateFin, 'yyyy-MM-dd HH:mm:ss');
      }

    });

    // apres avoir choisi une date
    startDateControl.valueChanges.subscribe((value: any) => {

      // je verifie si on a choisi une date
      if (value) {
        // this.projectSubmissionForm.get('endDate')?.enable();
        //si oui la date de end sera la date debut
        // c'est a dire on choisi à partir de la date de debut
        // la date de fin doit etre superieur ou egal àa la date debut
        this.projectSubmissionForm.patchValue({
          endDate: value
        });

        // la date min sera egal à la date debut
        this.minDateFinString = value;
        const dateFin = new Date(value);
        this.heureFinNumber = this.projectSubmissionForm.value.heureFin.getHours();
        this.minuteFinNumber = this.projectSubmissionForm.value.heureFin.getMinutes();
        dateFin.setHours(this.heureFinNumber, this.minuteFinNumber);
        this.endDateToString = format(dateFin, 'yyyy-MM-dd HH:mm:ss');


      }

      /* je l'ai mis ici parce que la date de ddebut recopie betement la date de fin */
      const hoursDebut = this.projectSubmissionForm.value.heureDebut.getHours().toString().padStart(2, '0');
      const minutesDebut = this.projectSubmissionForm.value.heureDebut.getMinutes().toString().padStart(2, '0');
      const dateDebut = new Date(this.projectSubmissionForm.value.startDate);

      dateDebut.setHours(hoursDebut);
      dateDebut.setMinutes(minutesDebut);

      this.startDateToString = format(dateDebut, 'yyyy-MM-dd HH:mm:ss');

    });

    // apres avoir choisi l'heure debut
    heureDebutControl.valueChanges.subscribe((value: any) => {

      /* je l'ai mis ici parce que la date de ddebut recopie betement la date de fin */
      const hoursDebut = value.getHours().toString().padStart(2, '0');
      const minutesDebut = value.getMinutes().toString().padStart(2, '0');
      const dateDebut = new Date(this.projectSubmissionForm.value.startDate);
      const dateFin = new Date(this.projectSubmissionForm.value.endDate);

      this.heureDebutNumber = value.getHours();
      this.minuteDebutNumber = value.getMinutes();
      if (dateDebut.getTime() === dateFin.getTime()) {
        if (value.getHours() > this.heureFinNumber) {

          dateDebut.setHours(this.heureFinNumber);
          this.projectSubmissionForm.patchValue({
            heureFin: dateDebut
          });

        } if (value.getHours() == this.heureFinNumber && value.getMinutes() > this.minuteFinNumber) {

          dateDebut.setHours(this.heureFinNumber);
          dateDebut.setMinutes(this.minuteFinNumber);
          this.projectSubmissionForm.patchValue({
            heureFin: dateDebut
          });

        } else {
          dateDebut.setHours(hoursDebut, minutesDebut, 0);
        }
      } else {
        dateDebut.setHours(hoursDebut, minutesDebut, 0);
      }

      this.startDateToString = format(dateDebut, 'yyyy-MM-dd HH:mm:ss');

    });

    heureFinControl.valueChanges.subscribe((value: any) => {

      /* je l'ai mis ici parce que la date de debut recopie betement la date de fin */
      const hoursFin = value.getHours().toString().padStart(2, '0');
      const minutesFin = value.getMinutes().toString().padStart(2, '0');
      const dateFin = new Date(this.projectSubmissionForm.value.endDate);
      const dateDebut = new Date(this.projectSubmissionForm.value.startDate);
      this.heureFinNumber = value.getHours();
      this.minuteFinNumber = value.getMinutes();

      if (dateDebut.getTime() === dateFin.getTime()) {

        if (value.getHours() < this.heureDebutNumber) {

          dateFin.setHours(this.heureDebutNumber);
          this.projectSubmissionForm.patchValue({
            heureFin: dateFin
          });

        } if (value.getHours() == this.heureDebutNumber && value.getMinutes() < this.minuteDebutNumber) {

          dateFin.setHours(this.heureDebutNumber);
          dateFin.setMinutes(this.minuteDebutNumber);
          this.projectSubmissionForm.patchValue({
            heureFin: dateFin
          });

        } else {
          dateFin.setHours(hoursFin, minutesFin, 0);
        }
      } else {
        dateFin.setHours(hoursFin, minutesFin, 0);
      }

      this.endDateToString = format(dateFin, 'yyyy-MM-dd HH:mm:ss');

    });

  }


  getControl(controlName: string) {
    return this.projectSubmissionForm.get(controlName);
  }

  nextStep() {
    if (this.step < 5)
      this.step++;
  }

  backStep() {
    if (this.step > 1)
      this.step--;
  }

  handleChange(fieldName: string) {
    const otherField = fieldName === 'confidentialite1' ? 'confidentialite2' : 'confidentialite1';
    if (this.projectSubmissionForm.get(fieldName)?.value) {
      this.projectSubmissionForm.get(otherField)?.setValue(false);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    const allowedChars = /^[0-9]+$/; // Expression régulière pour n'accepter que des chiffres

    // Vérifier si la touche saisie est autorisée
    if (!allowedChars.test(event.key)) {
      event.preventDefault(); // Empêcher la saisie du caractère non autorisé
    }
  }

  ajouterDate() {
    const [heures, minutes] = this.projectSubmissionForm.value.heure.split(':').map(Number);
    console.log(this.selectedDate + ' ' + heures + '-- ' + minutes);
    this.selectedDate?.setHours(heures, minutes);
    console.log(this.selectedDate);
    if (this.allDateChoosen.indexOf(this.selectedDate!) === -1)
      this.allDateChoosen.push(this.selectedDate!);
  }

  newCreneau() {
    this.selectedDate = null;
    this.projectSubmissionForm.get('heure')?.setValue('00:00');
  }
}
