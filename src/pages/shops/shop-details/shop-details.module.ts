import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopDetailsPage } from './shop-details';

@NgModule({
  declarations: [
    ShopDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopDetailsPage),
  ],
  exports: [
    ShopDetailsPage
  ]
})
export class ShopDetailsPageModule {}
