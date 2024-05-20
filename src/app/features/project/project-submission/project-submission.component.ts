import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Market } from '../../interfaces/market.model';
import { Domain } from '../../interfaces/domain.model';
import { ProjectService } from '../../services/project/project.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Disponibility } from '../../interfaces/disponibility.model';
import { ProjectVM } from '../../interfaces/project-vm.model';
import { AttachmentDto, AttachmentType } from '../../interfaces/attachment-dto.model';
import { digitOnly } from '../../interfaces/utils';

@Component({
  selector: 'app-project-submission',
  templateUrl: './project-submission.component.html',
  styleUrls: ['./project-submission.component.scss']
})
export class ProjectSubmissionComponent implements OnInit {

  step: number = 1;
  minDate!: Date;
  titleSteps = ["MODALITY", "ATTACHMENTS", "LAUNCH", "TO_END"];
  stepsIcons = [
    ["../../../assets/img/modality.svg", "../../../assets/img/modality-green.svg"],
    ["../../../assets/img/description.svg", "../../../assets/img/description-green.svg"],
    ["../../../assets/img/date-time.svg", "../../../assets/img/date-time-green.svg"],
    ["../../../assets/img/success-grey.svg", "../../../assets/img/success-green.svg"]
  ];
  projectSubmissionForm: FormGroup;

  heureDebutNumber!: number;
  minuteDebutNumber!: number;
  heureFinNumber!: number;
  minuteFinNumber!: number;
  minDateFinString!: string;
  startDateToString!: string;
  endDateToString!: string;
  token: string;
  selectedDate!: Date | null;
  allDateChoosen: Array<string> = [];
  markets: Array<Market> = [];
  market: Array<Market> = [];
  domains: Array<Domain> = [];
  domainChoosen: Array<string> = [];
  project: ProjectVM = {};
  disponibilites: Array<Disponibility> = [];
  filesChoosen: Array<string> = [];
  plansChoosen: Array<string> = [];
  allFiles: Array<AttachmentDto> = [];
  displayContractDuration: boolean = false;

  constructor(private toastr: ToastrService, private route: Router, private fb: FormBuilder, private authService: AuthService, private projectService: ProjectService) {
    authService.loggedOut();
    this.token = authService.isLogged()!;

    this.minDate = new Date();
    this.projectSubmissionForm = this.fb.group({
      intitule: new FormControl(null, [Validators.required]),
      client: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      // metier: new FormControl(null, [Validators.required]),
      confidentialite1: new FormControl(true, [Validators.required]),
      confidentialite2: new FormControl(false, [Validators.required]),
      marche: new FormControl(null, [Validators.required]),
      prixCible: new FormControl(null, [Validators.required]),
      typeDeBesoin: new FormControl(null, [Validators.required]),
      duree: new FormControl(null),
      volumeGlobal: new FormControl(null, [Validators.required]),
      budget: new FormControl(null, [Validators.required]),
      // delaiPlusTot: new FormControl(null, [Validators.required]),
      // delaiPlusTard: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      // fichiers: new FormControl(null, [Validators.required]),
      // plans: new FormControl(null, [Validators.required]),
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
    this.minDateFinString = format(dayStart, 'yyyy-MM-dd');
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
    if (this.step < 4)
      this.step++;
    else
      this.submit();
  }

  backStep() {
    if (this.step > 1)
      this.step--;

    if (this.step >= 4) {
      this.projectSubmissionForm.reset();
      this.route.navigate(['/home']);

    }
  }

  submit() {
    console.log(this.projectSubmissionForm.value);
    if (this.projectSubmissionForm.invalid || this.domainChoosen.length === 0 || this.allDateChoosen.length === 0) {
      this.toastr.error("veillez bien remplir tous les champs correctement", "Erreur soumission projet", {
        timeOut: 3000,
        positionClass: 'toast-top-center',
     });
    }
    else {

      const formvalue = this.projectSubmissionForm.value;
      this.project.client = formvalue.client;
      this.project.budget = formvalue.budget;
      this.project.confidential = formvalue.confidentialite1 ? formvalue.confidentialite1 : formvalue.confidentialite2;
      this.project.description = formvalue.description;
      this.project.disponibilityInstants = this.allDateChoosen;
      this.project.domains = this.domains.filter(domain => this.domainChoosen.includes(domain.name));
      this.project.duration = formvalue.duree;
      this.project.earliestDeadline = formvalue.startDate;
      this.project.globalVolume = formvalue.volumeGlobal;
      this.project.latestDeadline = formvalue.endDate;
      this.project.markets = this.markets.filter(market => market.name === formvalue.marche);;
      this.project.needType = formvalue.typeDeBesoin;
      this.project.targetPrice = formvalue.prixCible;
      this.project.title = formvalue.intitule;
      console.log(this.project);

      this.projectService.addProject(this.token, this.project).subscribe({
        next: (data) => {
          console.log(data);
          this.allFiles.forEach(file => {
            file.project = data;
            this.projectService.addProjectAttachments(this.token, file).subscribe({
              next: (data) => {
                console.log(data);

              },
              error: (err) => {

              }
            });
          });
          this.toastr.success("La soumission du projet a bien été effectué", "Succés", {
            timeOut: 3000,
            positionClass: 'toast-top-center',
         });
         this.step++;
        },
        error: (err) => {
          this.toastr.error("La soumission du projet a échoué", "Erreur soumission projet", {
            timeOut: 3000,
            positionClass: 'toast-top-center',
         });
        }
      });
    }
  }

  handleChange(fieldName: string) {
    const otherField = fieldName === 'confidentialite1' ? 'confidentialite2' : 'confidentialite1';
    if (this.projectSubmissionForm.get(fieldName)?.value) {
      this.projectSubmissionForm.get(otherField)?.setValue(false);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    digitOnly(event);
  }

  ajouterDate() {
    const [heures, minutes] = this.projectSubmissionForm.value.heure.split(':').map(Number);
    console.log(this.selectedDate + ' ' + heures + '-- ' + minutes);
    this.selectedDate?.setHours(heures, minutes);
    console.log(this.selectedDate);
    if (this.allDateChoosen.indexOf(this.selectedDate?.toISOString()!) === -1)
      this.allDateChoosen.push(this.selectedDate?.toISOString()!);
  }

  newCreneau() {
    this.selectedDate = null;
    this.projectSubmissionForm.get('heure')?.setValue('00:00');
  }

  onSelectDomain(value: any) {
    console.log(value);

    if (this.domainChoosen.indexOf(value) === -1)
      this.domainChoosen.push(value);
    console.log(this.domainChoosen);

  }

  removeDomain(item: string) {
    this.domainChoosen.splice(this.domainChoosen.indexOf(item), 1);
  }

  onSetStep(value: number) {
    if (value != 5)
      this.step = value;
  }

  gotoHome() {
    this.route.navigate(['/home']);
  }


  onFileSelected(event: any, indice: number) {
    const files: FileList = event.target.files;

    if (indice === 1) {
      // this.projectSubmissionForm.get('fichiers')?.setValue(file.name);
      this.filesChoosen = [];
    } else {
      this.plansChoosen = [];
    }

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      console.log('Nom du fichier:', file.name);
      console.log('Type du fichier:', file.type);
      console.log('Taille du fichier:', file.size, 'octets');
      // Vous pouvez envoyer chaque fichier à votre backend ou effectuer toute autre action nécessaire ici
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        // console.log(base64String);
        if (indice === 1) {
          let attachment: AttachmentDto = {
            name: file.name,
            type: AttachmentType.NORMAL,
            fileSize: file.size,
            base64Content: base64String
          };
          this.filesChoosen.push(file.name);
          this.allFiles.push(attachment);
        } else {
          let attachment: AttachmentDto = {
            name: file.name,
            type: AttachmentType.PLAN,
            fileSize: file.size,
            base64Content: base64String
          };
          this.plansChoosen.push(file.name);
          this.allFiles.push(attachment);
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  removeDate(item: string) {
    this.allDateChoosen.splice(this.allDateChoosen.indexOf(item), 1);
  }

  onTypeDeBesoinSelected(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === "CONTRACT") {
      this.displayContractDuration = true;
    } else {
      this.displayContractDuration = false;
    }
  }
}
