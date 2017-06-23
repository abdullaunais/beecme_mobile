import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from "./user-profile";
import { ParallaxHeader } from "./parallax-header";

@NgModule({
  declarations: [
    UserProfilePage,
    ParallaxHeader
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage)
  ],
  exports: [
    UserProfilePage
  ]
})
export class UserProfilePageModule {}