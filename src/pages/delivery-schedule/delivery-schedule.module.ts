import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliverySchedulePage } from "./delivery-schedule";

@NgModule({
  declarations: [
    DeliverySchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(DeliverySchedulePage),
  ],
  exports: [
    DeliverySchedulePage
  ]
})
export class DeliverySchedulePageModule {}