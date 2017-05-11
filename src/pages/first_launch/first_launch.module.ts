import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstLaunch } from "./first_launch";

@NgModule({
  declarations: [
    FirstLaunch,
  ],
  imports: [
    IonicPageModule.forChild(FirstLaunch),
  ],
  exports: [
    FirstLaunch
  ]
})
export class FirstLaunchModule {}