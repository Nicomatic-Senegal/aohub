import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { format } from 'date-fns';
import { EnterpriseDTO } from '../../interfaces/enterprise.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Market } from '../../interfaces/market.model';
import { Domain } from '../../interfaces/domain.model';
import { ProjectService } from '../../services/project/project.service';
import { EnterpriseService } from '../../services/enterprise/enterprise.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Disponibility } from '../../interfaces/disponibility.model';
import { ProjectVM } from '../../interfaces/project-vm.model';
import {
  AttachmentDto,
  AttachmentType,
} from '../../interfaces/attachment-dto.model';
import { ActivityDTO } from '../../interfaces/activity.model';
import { TypeAppelOffre } from '../../interfaces/appelOffre.model';
import { digitOnly } from '../../interfaces/utils';
import { TranslateService } from '@ngx-translate/core';
import { EmployeePostDTO } from '../../interfaces/employee.model';

@Component({
  selector: 'app-project-submission',
  templateUrl: './project-submission.component.html',
  styleUrls: ['./project-submission.component.scss'],
})
export class ProjectSubmissionComponent implements OnInit {
  /** Pour pouvoir utiliser TypeAppelOffre.* dans le template */
  public TypeAppelOffre = TypeAppelOffre;

  /** La liste qui viendra du back pour le multi‑select */

  public enterprisesList: EnterpriseDTO[] = [];

  step: number = 1;
  minDate!: Date;
  titleSteps = ['MODALITY', 'ATTACHMENTS', 'TO_END'];
  stepsIcons = [
    [
      '../../../assets/img/modality.svg',
      '../../../assets/img/modality-green.svg',
    ],
    [
      '../../../assets/img/description.svg',
      '../../../assets/img/description-green.svg',
    ],

    [
      '../../../assets/img/success-grey.svg',
      '../../../assets/img/success-green.svg',
    ],
  ];
  projectSubmissionForm: FormGroup;
  minDateFinString!: string;
  applicationClosingDateToString!: string;
  processingEndDateToString!: string;

  token: string;

  selectedActivities: ActivityDTO[] = [];
  selectedEnterprises: EnterpriseDTO[] = [];

  activitiesInvalid: boolean = false;
  selectedTypeAppelOffre: TypeAppelOffre | null = null;

  typeAppelOffreInvalid: boolean = false;
  activitySearchTerm: string = '';

  activitiesList: ActivityDTO[] = [];
  filteredActivitiesList: ActivityDTO[] = [];

  //domains: Array<Domain> = [];
  //domainChoosen: Array<string> = [];
  project: ProjectVM = {};
  disponibilites: Array<Disponibility> = [];
  filesChoosen: Array<string> = [];
  plansChoosen: Array<string> = [];
  allFiles: Array<AttachmentDto> = [];
  displayContractDuration: boolean = false;
  specifiedEnterprises: Array<EnterpriseDTO> = [];
  domainTranslationMap: Record<string, string> = {
    Décolletage: 'BAR_TURNING',
    Plasturgie: 'PLASTICS_TRANSFORMATION',
    'Traitement de surface': 'SURFACE_TREATMENT',
    Assemblage: 'ASSEMBLY',
    Usinage: 'MACHINING',
    'Produit standard': 'STANDARD_PRODUCT',
    Découpe: 'CUTTING_STAMPING',
    Électronique: 'ELECTRONICS',
    'Découpe laser': 'LASER_CUTTING',
  };
  marketTranslationMap: Record<string, string> = {
    Automobile: 'AUTOMOBILE',
    Aéronautique: 'AERONAUTICS',
    Énergie: 'ENERGY',
    Électronique: 'ELECTRONICS',
    Spatial: 'SPACE',
    'R&D': 'R_AND_D',
    Ingénierie: 'ENGINEERING',
    Médical: 'MEDICAL',
    Aérospatial: 'AEROSPACE',
    Militaire: 'MILITARY',
    Industriel: 'INDUSTRIAL',
    'Mobilité urbaine': 'URBAN_MOBILITY',
    Autre: 'OTHER',
  };

  constructor(
    private toastr: ToastrService,
    private route: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private projectService: ProjectService,
    private translateService: TranslateService
  ) {
    authService.loggedOut();
    this.token = authService.isLogged()!;

    this.minDate = new Date();
    this.projectSubmissionForm = this.fb.group({
      intitule: new FormControl(null, [Validators.required]),
      service: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      confidentialite1: new FormControl(true, [Validators.required]),
      confidentialite2: new FormControl(false, [Validators.required]),
      typeDeBesoin: new FormControl(null, [Validators.required]),
      duree: new FormControl(null),
      volumeGlobal: new FormControl(null, [Validators.required]),
      budget: new FormControl(null, [Validators.required]),
      applicationClosingDate: new FormControl(null, [Validators.required]),
      processingEndDate: new FormControl(null, [Validators.required]),
      selectedTypeAppelOffre: new FormControl(null, Validators.required),
      specifiedEnterprises: new FormControl([], []),
    });
    const specEntCtrl = this.projectSubmissionForm.get('specifiedEnterprises')!;
    specEntCtrl.setValidators(this.restrictedValidator.bind(this));
    this.projectSubmissionForm
      .get('selectedTypeAppelOffre')!
      .valueChanges.subscribe(() => specEntCtrl.updateValueAndValidity());

    const dayStart = new Date();
    const dayEnd = new Date();

    dayStart.setHours(0, 0, 0, 0);
    dayEnd.setHours(23, 50, 0, 0);

    this.projectSubmissionForm.patchValue({
      applicationClosingDate: format(dayStart, 'yyyy-MM-dd'),
      processingEndDate: format(dayEnd, 'yyyy-MM-dd'),
    });

    // pour afficher uniquement les date posterieur
    this.minDateFinString = format(dayStart, 'yyyy-MM-dd');
  }

  addActivity(activity: ActivityDTO): void {
    if (!this.selectedActivities.find((a) => a.id === activity.id)) {
      this.selectedActivities.push(activity);
    }
    this.activitySearchTerm = '';
    this.filteredActivitiesList = [];
    this.activitiesInvalid = false;
  }

  removeActivity(activity: ActivityDTO): void {
    this.selectedActivities = this.selectedActivities.filter(
      (a) => a.id !== activity.id
    );
    this.activitiesInvalid = this.selectedActivities.length === 0;
  }

  removeEnterprise(enterprise: EnterpriseDTO): void {
    this.selectedEnterprises = this.selectedEnterprises.filter(
      (e) => e.id !== enterprise.id
    );
  }
  addEnterprise(enterprise: EnterpriseDTO): void {
    if (!this.selectedEnterprises.find((e) => e.id === enterprise.id)) {
      this.selectedEnterprises.push(enterprise);
    }
  }

  onActivityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.activitySearchTerm = input.value;
    this.onSearchActivities();
  }

  getActivityName(activity: ActivityDTO): string {
    return activity.name || '';
  }

  onSearchActivities(): void {
    const term = this.activitySearchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredActivitiesList = [];
      return;
    }

    this.filteredActivitiesList = this.activitiesList.filter((activity) =>
      activity.name?.toLowerCase().includes(term)
    );
  }

  onTypeAppelOffreChange(event: any): void {
    const value = +event.target.value as TypeAppelOffre;
    this.selectedTypeAppelOffre = value;
    this.typeAppelOffreInvalid = this.selectedTypeAppelOffre === null;
  }
  restrictedValidator(control: AbstractControl) {
    const type = this.projectSubmissionForm.get(
      'selectedTypeAppelOffre'
    )?.value;
    // si « RESTRICTED » et aucune entreprise sélectionnée → erreur
    if (
      type === TypeAppelOffre.RESTRICTED &&
      (!control.value || control.value.length === 0)
    ) {
      return { required: true };
    }
    return null;
  }

  ngOnInit(): void {
    const applicationClosingDateControl: any = this.projectSubmissionForm.get(
      'applicationClosingDate'
    );
    const processingEndDateControl: any =
      this.projectSubmissionForm.get('processingEndDate');
    processingEndDateControl.valueChanges.subscribe((value: any) => {
      if (value) {
        const dateFin = new Date(value);
        this.processingEndDateToString = format(dateFin, 'yyyy-MM-dd');
      }
    });

    applicationClosingDateControl.valueChanges.subscribe((value: any) => {
      if (value) {
        this.projectSubmissionForm.patchValue({
          endDate: value,
        });

        this.minDateFinString = value;
        const dateFin = new Date(value);
        this.processingEndDateToString = format(dateFin, 'yyyy-MM-dd');
      }

      const dateDebut = new Date(this.projectSubmissionForm.value.startDate);

      this.applicationClosingDateToString = format(dateDebut, 'yyyy-MM-dd');
    });
    // après la création du form, par exemple à la fin du constructeur ou dans ngOnInit()
    this.projectSubmissionForm
      .get('specifiedEnterprises')!
      .setValidators((control) => {
        const type = this.projectSubmissionForm.get(
          'selectedTypeAppelOffre'
        )?.value;
        return type === TypeAppelOffre.RESTRICTED &&
          (!control.value || control.value.length === 0)
          ? { required: true }
          : null;
      });

    // et, pour recalculer la validité à chaque changement de type
    this.projectSubmissionForm
      .get('selectedTypeAppelOffre')!
      .valueChanges.subscribe(() => {
        this.projectSubmissionForm
          .get('specifiedEnterprises')!
          .updateValueAndValidity();
      });

    /*
     this.projectService.getAllDomains(this.token).subscribe({
      next: (data) => {
        this.domains = data.map((item: Domain) => ({
          ...item,
          translatedName: this.domainTranslationMap[item.name] || item.name,
        }));
      },
      error: (err) => {
        console.log(err);
        this.translateService
          .get(['ERROR_FETCHING_DOMAINS', 'ERROR_TITLE'])
          .subscribe((translations) => {
            this.toastr.error(
              translations['ERROR_FETCHING_DOMAINS'],
              translations['ERROR_TITLE'],
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          });
      },
    });*/
    this.projectService.getAllActivities(this.token).subscribe({
      next: (data) => {
        this.activitiesList = data;
        this.filteredActivitiesList = data; // initialiser l’affichage complet
      },
      error: (err) => {
        console.error('Erreur récupération activités', err);
        this.translateService
          .get(['ERROR_FETCHING_ACTIVITIES', 'ERROR_TITLE'])
          .subscribe((translations) => {
            this.toastr.error(
              translations['ERROR_FETCHING_ACTIVITIES'],
              translations['ERROR_TITLE'],
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          });
      },
    });
    this.projectService.getAllEnterprises().subscribe({
      next: (data: EnterpriseDTO[]) => (this.enterprisesList = data),
      error: (err) => console.error('Erreur entreprises', err),
    });
  }

  getControl(controlName: string) {
    return this.projectSubmissionForm.get(controlName);
  }

  nextStep() {
    if (this.step < 3) this.step++;
    else this.submit();
  }

  backStep() {
    if (this.step > 1) this.step--;

    if (this.step >= 4) {
      this.projectSubmissionForm.reset();
      this.route.navigate(['/home']);
    }
  }

  submit() {
    // 1) Récupère les valeurs du form
    const f = this.projectSubmissionForm.value as any;

    // 2) Validation des activités et du type d'appel
    this.activitiesInvalid = this.selectedActivities.length === 0;
    this.typeAppelOffreInvalid = f.selectedTypeAppelOffre == null;

    if (
      this.projectSubmissionForm.invalid ||
      this.activitiesInvalid ||
      this.typeAppelOffreInvalid
    ) {
      this.translateService
        .get([
          'ERROR_FIELD_NOT_CONFORM_PROJECT_SUBMISSION',
          'ERROR_PROJECT_SUBMISSION_TITLE',
        ])
        .subscribe((translations) => {
          this.toastr.error(
            translations['ERROR_FIELD_NOT_CONFORM_PROJECT_SUBMISSION'],
            translations['ERROR_PROJECT_SUBMISSION_TITLE'],
            {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            }
          );
        });
      return;
    }

    // 3) On construit l'objet projectVM
    this.project.service = f.service;
    this.project.budget = f.budget;
    this.project.confidential = f.confidentialite1;
    this.project.description = f.description;
    this.project.activities = this.selectedActivities;
    this.project.aoType = f.selectedTypeAppelOffre;
    this.project.duration = f.duree;
    this.project.applicationClosingDate = f.applicationClosingDate;
    this.project.globalVolume = f.volumeGlobal;
    this.project.processingEndDate = f.processingEndDate;
    this.project.needType = f.typeDeBesoin;
    this.project.title = f.intitule;

    // 4) Si consultation restreinte, on ajoute specifiedEnterprises
    if (f.selectedTypeAppelOffre === TypeAppelOffre.RESTRICTED) {
      this.project.specifiedEnterprises = f.specifiedEnterprises;
    }

    console.log('Payload project:', this.project);

    // 5) Envoi au back
    this.projectService.addProject(this.token, this.project).subscribe({
      next: (data) => {
        // Ajout des pièces jointes
        this.allFiles.forEach((file) => {
          file.project = data;
          this.projectService.addProjectAttachments(this.token, file).subscribe(
            () => {},
            () => {}
          );
        });
        // Toast de succès et passage à l'étape suivante
        this.translateService
          .get(['SUCCESS_PROJECT_SUBMISSION', 'SUCCESS_TITLE'])
          .subscribe((translations) => {
            this.toastr.success(
              translations['SUCCESS_PROJECT_SUBMISSION'],
              translations['SUCCESS_TITLE'],
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          });
        this.step++;
      },
      error: () => {
        this.translateService
          .get(['ERROR_PROJECT_SUBMISSION', 'ERROR_TITLE'])
          .subscribe((translations) => {
            this.toastr.error(
              translations['ERROR_PROJECT_SUBMISSION'],
              translations['ERROR_TITLE'],
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          });
      },
    });
  }

  handleChange(fieldName: string) {
    const otherField =
      fieldName === 'confidentialite1'
        ? 'confidentialite2'
        : 'confidentialite1';
    if (this.projectSubmissionForm.get(fieldName)?.value) {
      this.projectSubmissionForm.get(otherField)?.setValue(false);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    digitOnly(event);
  }

  /*onSelectDomain(value: any) {
    if (this.domainChoosen.indexOf(value) === -1)
      this.domainChoosen.push(value);
  }

  removeDomain(item: string) {
    this.domainChoosen.splice(this.domainChoosen.indexOf(item), 1);
  }*/

  onSetStep(value: number) {
    if (value != 5) this.step = value;
  }

  gotoHome() {
    this.route.navigate(['/home']);
  }

  onFileSelected(event: any, indice: number) {
    const files: FileList = event.target.files;

    if (indice === 1) {
      this.filesChoosen = [];
    } else {
      this.plansChoosen = [];
    }

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        if (indice === 1) {
          let attachment: AttachmentDto = {
            name: file.name,
            type: AttachmentType.NORMAL,
            fileSize: file.size,
            base64Content: base64String,
          };
          this.filesChoosen.push(file.name);
          this.allFiles.push(attachment);
        } else {
          let attachment: AttachmentDto = {
            name: file.name,
            type: AttachmentType.PLAN,
            fileSize: file.size,
            base64Content: base64String,
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

  onTypeDeBesoinSelected(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'CONTRACT') {
      this.displayContractDuration = true;
    } else {
      this.displayContractDuration = false;
    }
  }

  translateDomain(domain: string) {
    return this.domainTranslationMap[domain] || domain;
  }
}
