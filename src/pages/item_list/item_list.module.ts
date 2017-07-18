import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemList } from "./item_list";
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    ItemList,
  ],
  imports: [
    IonicPageModule.forChild(ItemList),
    LazyLoadImageModule
  ],
  exports: [
    ItemList
  ]
})
export class ItemListModule {}