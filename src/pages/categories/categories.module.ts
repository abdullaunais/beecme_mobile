import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Categories } from "./categories";
import { LazyLoadImageModule } from "ng-lazyload-image";

@NgModule({
  declarations: [
    Categories,
  ],
  imports: [
    IonicPageModule.forChild(Categories),
    LazyLoadImageModule
  ],
  exports: [
    Categories
  ]
})
export class CategoriesModule {}