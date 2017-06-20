import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from "./user-profile";
import { ParallaxHeader } from "../../directives/parallax-header/parallax-header";

@NgModule({
  declarations: [
    UserProfilePage,
    ParallaxHeader
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
  ],
  exports: [
    UserProfilePage
    
  ]
})
export class UserProfilePageModule {}