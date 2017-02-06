import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import {FirstLaunch} from "../pages/first_launch/first_launch";
import {Categories} from "../pages/categories/categories";
import {ItemList} from "../pages/item_list/item_list";
import {DetailsPage} from "../pages/details/details";
import {Config} from "../providers/config";


@Component({
  templateUrl: 'app.html',
  providers: [Config]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = FirstLaunch;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Welcome', component: FirstLaunch },
      { title: 'Categories', component: Categories },
      { title: 'List', component: ItemList },
      { title: 'Details', component: DetailsPage },
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
