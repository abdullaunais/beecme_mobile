import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from "./cart";
import { LazyLoadImageModule } from "ng-lazyload-image";

@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    LazyLoadImageModule
  ],
  exports: [
    CartPage
  ]
})
export class CartPageModule {}