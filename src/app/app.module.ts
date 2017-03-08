import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import {FirstLaunch} from "../pages/first_launch/first_launch";
import {Categories} from "../pages/categories/categories";
import {ItemList} from "../pages/item_list/item_list";
import {DetailsPage} from "../pages/details/details";
import {CartPage} from "../pages/cart/cart";
import {UserRegistrationPage} from "../pages/user-registration/user-registration";
import {UserRegisterConfirmationPage} from "../pages/user-register-confirmation/user-register-confirmation";
import {UserProfilePage} from "../pages/user-profile/user-profile";


@NgModule({
  declarations: [
    MyApp,
    FirstLaunch,
    Categories,
    ItemList,
    DetailsPage,
    CartPage,
    UserRegistrationPage,
    UserRegisterConfirmationPage,
    UserProfilePage,
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
    UserRegistrationPage,
    UserRegisterConfirmationPage,
    UserProfilePage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})
export class AppModule {}
