import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderFeedback } from "./order-feedback";
import { StarRatingModule } from "../../../directives/star-rating/star-rating.module";

@NgModule({
  declarations: [
    OrderFeedback,
  ],
  imports: [
    IonicPageModule.forChild(OrderFeedback),
    StarRatingModule
  ],
  exports: [
    OrderFeedback
  ]
})
export class OrderFeedbackModule {}