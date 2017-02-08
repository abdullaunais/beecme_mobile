import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import {FirstLaunch} from "../pages/first_launch/first_launch";
import {Categories} from "../pages/categories/categories";
import {ItemList} from "../pages/item_list/item_list";
import {DetailsPage} from "../pages/details/details";
import {CartPage} from "../pages/cart/cart";


@NgModule({
  declarations: [
    MyApp,
    FirstLaunch,
    Categories,
    ItemList,
    DetailsPage,
    CartPage,
    Page1,
    Page2
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FirstLaunch,
    Categories,
    ItemList,
    DetailsPage,
    CartPage,
    Page1,
    Page2
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})
export class AppModule {}
