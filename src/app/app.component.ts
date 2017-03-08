import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

import {FirstLaunch} from "../pages/first_launch/first_launch";
import {Categories} from "../pages/categories/categories";
import {CartPage} from "../pages/cart/cart";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {Config} from "../providers/config";



@Component({
  templateUrl: 'app.html',
  providers: [Config]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Categories;

  pages: Array<{title: string, component: any, icon: string, devide: boolean}>;

  constructor(public platform: Platform, storage: Storage) {
    storage.get('location.set').then((response) => {
      if(!response) {
        this.rootPage = FirstLaunch;
      }
    });
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Categories', component: Categories, icon: 'apps', devide:false },
      { title: 'My Cart', component: CartPage, icon: 'cart', devide:false },
      { title: 'My Orders', component: CartPage, icon: 'cash', devide: true },
      // { title: 'List', component: ItemList, icon: '' },
      // { title: 'Details', component: DetailsPage, icon: '' },
      // { title: 'User Registration', component: UserRegistrationPage, icon: '' },
      { title: 'Profile', component: UserProfilePage, icon: 'person', devide:false },
      { title: 'Settings', component: UserProfilePage, icon: 'settings', devide:false }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // StatusBar.styleDefault();
      StatusBar.backgroundColorByHexString('#279f46');
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
