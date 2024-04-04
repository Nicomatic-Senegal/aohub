import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ManagedUserVM } from './interfaces/managed-user-vm.model';
import { LoginVM } from './interfaces/login-vm.model';
import { SpinnerComponent } from '../spinner/spinner.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    HttpClientModule
  ],
  exports: [],
  providers: [
    ManagedUserVM,
    LoginVM
  ]
})
export class CoreModule { }
