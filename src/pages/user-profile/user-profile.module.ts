import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from "./user-profile";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    UserProfilePage
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
    LazyLoadImageModule,
    IonicImageViewerModule
  ],
  exports: [
    UserProfilePage
  ]
})
export class UserProfilePageModule {}