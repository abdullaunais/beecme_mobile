import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Shops } from "./shops";
import { LazyLoadImageModule } from "ng-lazyload-image";

@NgModule({
  declarations: [
    Shops,
  ],
  imports: [
    IonicPageModule.forChild(Shops),
    LazyLoadImageModule
  ],
  exports: [
    Shops
  ]
})
export class ShopsModule {}