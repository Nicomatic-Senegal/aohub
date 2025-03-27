// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './features/utils/loading/loading.interceptor';
import { SpinnerComponent } from './spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token'); // Adjust this to your token storage method
        },
        allowedDomains: ['example.com'], // Replace with your API domain
        disallowedRoutes: ['example.com/unauthorized'], // Replace with your unauthorized routes
      },
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-middle-center',
      timeOut: 0,
      closeButton: true,
      tapToDismiss: true,
      preventDuplicates: true,
      enableHtml: true,
      toastClass: 'ngx-toastr',
      messageClass: 'ngx-toastr-message',
      titleClass: 'ngx-toastr-title',
      progressBar: true,
      progressAnimation: 'decreasing'
    }),
    FontAwesomeModule
  ],
  providers: [
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
