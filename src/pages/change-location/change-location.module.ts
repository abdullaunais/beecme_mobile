import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeLocation } from "./change-location";

@NgModule({
  declarations: [
    ChangeLocation,
  ],
  imports: [
    IonicPageModule.forChild(ChangeLocation),
  ],
  exports: [
    ChangeLocation
  ]
})
export class ChangeLocationModule {}