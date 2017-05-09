import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { MyApp } from './app.component';
import { FirstLaunch } from "../pages/first_launch/first_launch";
import { Categories } from "../pages/categories/categories";
import { ItemList } from "../pages/item_list/item_list";
import { DetailsPage } from "../pages/details/details";
import { CartPage } from "../pages/cart/cart";
import { UserRegistrationPage } from "../pages/user-registration/user-registration";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { UserLoginPage } from "../pages/user-login/user-login";
import { DeliverySchedulePage } from "../pages/delivery-schedule/delivery-schedule";
import { OrderSummaryPage } from "../pages/order-summary/order-summary";
import { AppSettingsPage } from "../pages/app-settings/app-settings";
import { ImageSliderPage } from "../pages/image-slider/image-slider";
import { OrderHistoryPage } from "../pages/order-history/order-history";
import { ChangeLocation } from "../pages/change-location/change-location";
import { Config } from "../providers/config";
import { Variables } from "../providers/variables";
import { Shops } from "../pages/shops/shops";


@NgModule({
  declarations: [
    MyApp,
    FirstLaunch,
    Categories,
    Shops,
    ItemList,
    DetailsPage,
    ImageSliderPage,
    CartPage,
    UserRegistrationPage,
    UserProfilePage,
    AppSettingsPage,
    UserLoginPage,
    DeliverySchedulePage,
    OrderSummaryPage,
    OrderHistoryPage,
    ChangeLocation
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'push',
        }
      }
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FirstLaunch,
    Shops,
    Categories,
    ItemList,
    DetailsPage,
    ImageSliderPage,
    CartPage,
    UserRegistrationPage,
    UserProfilePage,
    AppSettingsPage,
    UserLoginPage,
    DeliverySchedulePage,
    OrderSummaryPage,
    OrderHistoryPage,
    ChangeLocation
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, StatusBar, SplashScreen, Config, Variables]
})
export class AppModule { }
