import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Shops } from "./shops";

@NgModule({
  declarations: [
    Shops,
  ],
  imports: [
    IonicPageModule.forChild(Shops),
  ],
  exports: [
    Shops
  ]
})
export class ShopsModule {}