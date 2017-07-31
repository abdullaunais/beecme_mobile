import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from "./details";
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    DetailsPage
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