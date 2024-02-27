import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SelectionnerLangueComponent } from './selectionner-langue/selectionner-langue.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';


@NgModule({
  declarations: [
    SelectionnerLangueComponent,
    SideBarComponent,
    TopBarComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    SelectionnerLangueComponent,
    SideBarComponent,
    TopBarComponent
  ]
})
export class SharedModule {

 }
