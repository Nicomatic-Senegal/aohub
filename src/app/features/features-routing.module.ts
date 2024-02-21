import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { MotDePasseOublieProcessusComponent } from './mot-de-passe-oublie-processus/mot-de-passe-oublie-processus.component';
import { ParametresComponent } from './parametres/parametres.component';

const routes: Routes = [
  {path: 'signup', component: InscriptionComponent},
  {path: 'signin', component: ConnexionComponent},
  {path: 'forget-password', component: MotDePasseOublieProcessusComponent},
  {path: 'setting', component: ParametresComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
