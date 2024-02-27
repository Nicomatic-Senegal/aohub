import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SelectionnerLangueComponent } from './selectionner-langue/selectionner-langue.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SelectionnerLangueComponent,
    SideBarComponent,
    TopBarComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    SelectionnerLangueComponent,
    SideBarComponent,
    TopBarComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule {

 }
