import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { MotDePasseOublieProcessusComponent } from './mot-de-passe-oublie-processus/mot-de-passe-oublie-processus.component';
import { SharedModule } from '../shared/shared.module';
import { ParametresComponent } from './parametres/parametres.component';
import { ParametreProfilComponent } from './parametre-profil/parametre-profil.component';
import { ParametreNotificationComponent } from './parametre-notification/parametre-notification.component';
import { ParametreMotDePasseComponent } from './parametre-mot-de-passe/parametre-mot-de-passe.component';
import { CoreModule } from '../core/core.module';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { AccountResetInitComponent } from './account-reset-init/account-reset-init.component';
import { HomeComponent } from './home/home.component';
import { GalleryModule } from 'ng-gallery';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { ProjectSubmissionComponent } from './project-submission/project-submission.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ApplyProjectDialogComponent } from './apply-project-dialog/apply-project-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from './paginator/paginator.component';


@NgModule({
  declarations: [
    InscriptionComponent,
    ConnexionComponent,
    MotDePasseOublieProcessusComponent,
    ParametresComponent,
    ParametreProfilComponent,
    ParametreNotificationComponent,
    ParametreMotDePasseComponent,
    ActivateAccountComponent,
    AccountResetInitComponent,
    HomeComponent,
    OpportunitiesComponent,
    ProjectSubmissionComponent,
    ApplyProjectDialogComponent,
    ImageSliderComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    SharedModule,
    CoreModule,
    GalleryModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule
  ]

})
export class FeaturesModule { }
