import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateProfile } from "./update-profile";

@NgModule({
  declarations: [
    UpdateProfile,
  ],
  imports: [
    IonicPageModule.forChild(UpdateProfile),
  ],
  exports: [
    UpdateProfile
  ]
})
export class UpdateProfileModule {}