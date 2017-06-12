import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsAndConditions } from "./terms-and-conditions";

@NgModule({
  declarations: [
    TermsAndConditions,
  ],
  imports: [
    IonicPageModule.forChild(TermsAndConditions),
  ],
  exports: [
    TermsAndConditions
  ]
})
export class TermsAndConditionsModule {}