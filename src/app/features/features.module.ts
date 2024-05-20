import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { SignupComponent } from './user-account/signup/signup.component';
import { SigninComponent } from './user-account/signin/signin.component';
import { ForgetPasswordComponent } from './user-account/forget-password/forget-password.component';
import { SharedModule } from '../shared/shared.module';
import { SettingLayoutComponent } from './settings/setting-layout/setting-layout.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { NotificationComponent } from './settings/notification/notification.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { CoreModule } from '../core/core.module';
import { ActivateAccountComponent } from './user-account/activate-account/activate-account.component';
import { AccountResetInitComponent } from './user-account/account-reset-init/account-reset-init.component';
import { HomeComponent } from './home/home.component';
import { GalleryModule } from 'ng-gallery';
import { OpportunitiesComponent } from './opportunity/opportunities/opportunities.component';
import { ProjectSubmissionComponent } from './project/project-submission/project-submission.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ApplyProjectDialogComponent } from './dialog/apply-project-dialog/apply-project-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from './utils/paginator/paginator.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CustomDateAdapter } from './interfaces/custom-date-adapter';
import { OpportunityTrackingComponent } from './opportunity/opportunity-tracking/opportunity-tracking.component';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { SupportComponent } from './support/support.component';
import { ShowMoreDialogComponent } from './dialog/show-more-dialog/show-more-dialog.component';
import { PartnerDetailsDialogComponent } from './dialog/partner-details-dialog/partner-details-dialog.component';
import { EnterpriseDetailsDialogComponent } from './dialog/enterprise-details-dialog/enterprise-details-dialog.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PopupComponent } from './all-popup/popup/popup.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectsComponent } from './project/projects/projects.component';
import { ProjectOptionsComponent } from './project/project-options/project-options.component';
import { PopupDeleteProjectComponent } from './all-popup/popup-delete-project/popup-delete-project.component';
import { PopupModifyProjectComponent } from './all-popup/popup-modify-project/popup-modify-project.component';
import { OpinionComponent } from './opinion/opinion.component';
import { ActivityComponent } from './activity/activity.component';
import { AngularD3CloudModule } from 'angular-d3-cloud';
import { NgApexchartsModule } from "ng-apexcharts";
import { ProjectTrackingComponent } from './project/project-tracking/project-tracking.component';
import { PopupAddEventComponent } from './all-popup/popup-add-event/popup-add-event.component';
import { PopupAddParticipantComponent } from './all-popup/popup-add-participant/popup-add-participant.component';
import { LayoutComponent } from './layout/layout/layout.component';

registerSwiperElements();

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    ForgetPasswordComponent,
    SettingLayoutComponent,
    ProfileComponent,
    NotificationComponent,
    ChangePasswordComponent,
    ActivateAccountComponent,
    AccountResetInitComponent,
    HomeComponent,
    OpportunitiesComponent,
    ProjectSubmissionComponent,
    ApplyProjectDialogComponent,
    ImageSliderComponent,
    PaginatorComponent,
    OpportunityTrackingComponent,
    SupportComponent,
    ShowMoreDialogComponent,
    PartnerDetailsDialogComponent,
    EnterpriseDetailsDialogComponent,
    PopupComponent,
    ProjectDetailsComponent,
    ProjectsComponent,
    ProjectOptionsComponent,
    PopupDeleteProjectComponent,
    PopupModifyProjectComponent,
    OpinionComponent,
    ActivityComponent,
    ProjectTrackingComponent,
    PopupAddEventComponent,
    PopupAddParticipantComponent,
    LayoutComponent
  ],
  imports: [
    NgApexchartsModule,
    AngularD3CloudModule,
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
    MatTableModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // Utilisez la langue de votre choix, par exemple 'fr-FR' pour le français
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class FeaturesModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translate/', '.json');
}
