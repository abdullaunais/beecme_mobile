import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopDetailsPage } from './shop-details';
import { LazyLoadImageModule } from "ng-lazyload-image";

@NgModule({
  declarations: [
    ShopDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopDetailsPage),
    LazyLoadImageModule
  ],
  exports: [
    ShopDetailsPage
  ]
})
export class ShopDetailsPageModule { }
