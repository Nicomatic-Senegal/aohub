import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { MotDePasseOublieProcessusComponent } from './mot-de-passe-oublie-processus/mot-de-passe-oublie-processus.component';
import { ParametresComponent } from './parametres/parametres.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { AccountResetInitComponent } from './account-reset-init/account-reset-init.component';
import { HomeComponent } from './home/home.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';

const routes: Routes = [
  { path: 'signup', component: InscriptionComponent },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signin', component: ConnexionComponent },
  { path: 'forget-password', component: MotDePasseOublieProcessusComponent },
  { path: 'setting', component: ParametresComponent },
  { path: 'account/activate', component: ActivateAccountComponent },
  { path: 'account/reset/finish', component: AccountResetInitComponent },
  { path: 'home', component: HomeComponent },
  { path: 'opportunities', component: OpportunitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
