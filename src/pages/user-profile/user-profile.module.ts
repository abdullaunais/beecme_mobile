import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from "./user-profile";
import { LazyLoadImageModule } from "ng-lazyload-image";

@NgModule({
  declarations: [
    UserProfilePage
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
    LazyLoadImageModule
  ],
  exports: [
    UserProfilePage
  ]
})
export class UserProfilePageModule {}