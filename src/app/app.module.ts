import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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


@NgModule({
  declarations: [
    MyApp,
    FirstLaunch,
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
    OrderHistoryPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'overlay',
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FirstLaunch,
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
    OrderHistoryPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Storage]
})
export class AppModule { }
