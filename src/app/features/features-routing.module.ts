import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './user-account/signup/signup.component';
import { SigninComponent } from './user-account/signin/signin.component';
import { ForgetPasswordComponent } from './user-account/forget-password/forget-password.component';
import { SettingLayoutComponent } from './settings/setting-layout/setting-layout.component';
import { ActivateAccountComponent } from './user-account/activate-account/activate-account.component';
import { AccountResetInitComponent } from './user-account/account-reset-init/account-reset-init.component';
import { HomeComponent } from './home/home.component';
import { OpportunitiesComponent } from './opportunity/opportunities/opportunities.component';
import { ProjectSubmissionComponent } from './project/project-submission/project-submission.component';
import { ApplyProjectDialogComponent } from './dialog/apply-project-dialog/apply-project-dialog.component';
import { OpportunityTrackingComponent } from './opportunity/opportunity-tracking/opportunity-tracking.component';
import { SupportComponent } from './support/support.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectsComponent } from './project/projects/projects.component';
import { ProjectOptionsComponent } from './project/project-options/project-options.component';
import { ActivityComponent } from './activity/activity.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'setting', component: SettingLayoutComponent },
  { path: 'account/activate', component: ActivateAccountComponent },
  { path: 'account/reset/finish', component: AccountResetInitComponent },
  { path: 'home', component: HomeComponent },
  { path: 'opportunities', component: OpportunitiesComponent },
  { path: 'project-submission', component: ProjectSubmissionComponent },
  { path: 'apply-project', component: ApplyProjectDialogComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'support', component: SupportComponent },
  { path: 'project-options', component: ProjectOptionsComponent },
  { path: 'activity', component: ActivityComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
