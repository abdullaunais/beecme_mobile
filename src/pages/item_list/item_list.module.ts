import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemList } from "./item_list";

@NgModule({
  declarations: [
    ItemList,
  ],
  imports: [
    IonicPageModule.forChild(ItemList),
  ],
  exports: [
    ItemList
  ]
})
export class ItemListModule {}