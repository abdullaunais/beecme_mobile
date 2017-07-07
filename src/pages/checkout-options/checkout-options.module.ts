import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutOptionsPage } from './checkout-options';

@NgModule({
  declarations: [
    CheckoutOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutOptionsPage),
  ],
  exports: [
    CheckoutOptionsPage
  ]
})
export class CheckoutOptionsPageModule {}
