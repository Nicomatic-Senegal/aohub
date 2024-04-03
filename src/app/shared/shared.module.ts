import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SelectionnerLangueComponent } from './selectionner-langue/selectionner-langue.component';
import { SideBarComponent } from '../features/side-bar/side-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VerticalCarousselComponent } from './vertical-caroussel/vertical-caroussel.component';
import { HorizontalCarousselComponent } from './horizontal-caroussel/horizontal-caroussel.component';
import { GalleryModule } from 'ng-gallery';


@NgModule({
  declarations: [
    SelectionnerLangueComponent,
    SideBarComponent,
    TopBarComponent,
    VerticalCarousselComponent,
    HorizontalCarousselComponent
  ],
  imports: [
    GalleryModule,
    CommonModule,
    SharedRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SelectionnerLangueComponent,
    SideBarComponent,
    TopBarComponent,
    HorizontalCarousselComponent,
    VerticalCarousselComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule {

 }
