import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from "./details";
import { ParallaxHeader } from "./parallax-header";
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    DetailsPage,
    ParallaxHeader
  ],
  imports: [
    IonicImageViewerModule,
    IonicPageModule.forChild(DetailsPage),
  ],
  exports: [
    DetailsPage
  ]
})
export class DetailsPageModule {}