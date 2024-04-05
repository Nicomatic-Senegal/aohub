import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { format } from 'date-fns';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Market } from '../interfaces/market.model';
import { Project } from '../interfaces/project.model';
import { Domain } from '../interfaces/domain.model';
import { ProjectService } from '../services/project/project.service';

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
  markets: Array<Market> = [];
  domains: Array<Domain> = [];
  project: Project = {};



  constructor(private fb: FormBuilder, private authService: AuthService, private projectService: ProjectService) {
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
      endDate: format(dayEnd, 'yyyy-MM-dd')
    });

    // pour afficher uniquement les date posterieur
    this.minDateFinString = format(dayStart, 'yyyy-MM-dd')

  }

  ngOnInit(): void {
    const startDateControl: any = this.projectSubmissionForm.get('startDate');
    const endDateControl: any = this.projectSubmissionForm.get('endDate');
    endDateControl.valueChanges.subscribe((value: any) => {

      if (value) {
        const dateFin = new Date(value);
        this.endDateToString = format(dateFin, 'yyyy-MM-dd');
      }

    });

    startDateControl.valueChanges.subscribe((value: any) => {
      if (value) {
        this.projectSubmissionForm.patchValue({
          endDate: value
        });

        this.minDateFinString = value;
        const dateFin = new Date(value);
        this.endDateToString = format(dateFin, 'yyyy-MM-dd');
      }

      const dateDebut = new Date(this.projectSubmissionForm.value.startDate);

      this.startDateToString = format(dateDebut, 'yyyy-MM-dd');

    });

    this.projectService.getAllDomains(this.token).subscribe({
      next: (data) => {
        this.domains = data;
        console.log(this.domains);

      },
      error: (err) => {

      }
    });

    this.projectService.getAllMarkets(this.token).subscribe({
      next: (data) => {
        this.markets = data;
        console.log(this.markets);

      },
      error: (err) => {

      }
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
