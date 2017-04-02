import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { FirstLaunch } from "../pages/first_launch/first_launch";
import { Categories } from "../pages/categories/categories";
import { CartPage } from "../pages/cart/cart";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { UserLoginPage } from "../pages/user-login/user-login";
import { Config } from "../providers/config";
import { AppSettingsPage } from "../pages/app-settings/app-settings";
import { OrderHistoryPage } from "../pages/order-history/order-history";



@Component({
  templateUrl: 'app.html',
  providers: [Config]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Categories;
  profileLabel: string;
  profilepic: string;
  isLogin: boolean = false;
  profileComponent: any;

  pages: Array<{ title: string, component: any, icon: string, devide: boolean }>;

  constructor(public platform: Platform, storage: Storage, public menuCtrl: MenuController) {
    this.initializeApp();
    storage.get('location.set').then((locationSet) => {
      if (!locationSet) {
        this.rootPage = FirstLaunch;
        
      }
    });

    storage.get('user.data').then((response) => {
      if (response) {
        if (response.email != undefined || response.email != null) {
          this.profileLabel = response.email;
          this.isLogin = true;
          if(response.profilePicture !== null){
            this.profilepic = response.profilePicture;
          } else {
            this.profilepic = "assets/img/cover/profile_default.jpg";
          }
          
        } else {
          this.profileLabel = "Sign In";
          this.isLogin = false;
        }
      } else {
        this.profileLabel = "Sign In";
        this.isLogin = false;
      }


      if (this.isLogin) {
        this.profileComponent = {
          title: 'Profile', component: UserProfilePage, icon: 'person', devide: false
        }
      } else {
        this.profileComponent = {
          title: 'Sign In', component: UserLoginPage, icon: 'person', devide: false
        }
      }

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Categories', component: Categories, icon: 'apps', devide: false },
        { title: 'My Cart', component: CartPage, icon: 'cart', devide: false },
        { title: 'My Orders', component: OrderHistoryPage, icon: 'cash', devide: true },
        // { title: 'List', component: ItemList, icon: '' },
        // { title: 'Details', component: DetailsPage, icon: '' },
        // { title: 'User Registration', component: UserRegistrationPage, icon: '' },
        this.profileComponent,
        { title: 'Settings', component: AppSettingsPage, icon: 'settings', devide: false }
      ];
    });

    


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

  loginOrProfile() {
    if (this.isLogin) {
      this.nav.push(UserProfilePage);
      this.menuCtrl.close();
    } else {
      this.nav.push(UserLoginPage);
      this.menuCtrl.close();
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
