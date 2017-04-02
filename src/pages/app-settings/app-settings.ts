import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Categories } from "../categories/categories";
import { UserLoginPage } from "../user-login/user-login";

/*
  Generated class for the AppSettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html'
})
export class AppSettingsPage {
  storage: Storage;
  logTitle: string = "Login";
  isLogin: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage) {
    this.storage = storage;
    storage.get("user.login").then((response) => {
      if(response) {
        this.logTitle = "Logout"
        this.isLogin = true;
      } else {
        this.logTitle = "Login"
        this.isLogin = false;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppSettingsPage');
  }

  loginOrLogout() {
    if(this.isLogin) {
      this.storage.set("user.login", false).then((res1) => {
      this.storage.set("user.data", {}).then((res2) => {
        this.navCtrl.setRoot(Categories, null);
      });
    });
    } else {
      this.navCtrl.setRoot(UserLoginPage, null);
    }
    
    
  }

}
