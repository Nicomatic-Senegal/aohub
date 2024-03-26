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
import { ToastrModule } from 'ngx-toastr';
import { OpportunitiesComponent } from './opportunities/opportunities.component';


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
    OpportunitiesComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    SharedModule,
    CoreModule,
    GalleryModule,
  ],

})
export class FeaturesModule { }
