import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from "./details";
import { ParallaxHeader } from "./parallax-header";

@NgModule({
  declarations: [
    DetailsPage,
    ParallaxHeader
  ],
  imports: [
    IonicPageModule.forChild(DetailsPage),
  ],
  exports: [
    DetailsPage
  ]
})
export class DetailsPageModule {}