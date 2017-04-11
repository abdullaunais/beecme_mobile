import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Categories } from "../categories/categories";
import { UserLoginPage } from "../user-login/user-login";
import { Variables } from "../../providers/variables";
import { ChangeLocation } from "../change-location/change-location";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    storage: Storage,
    private variables: Variables,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.storage = storage;
    this.variables.login.subscribe(value => this.isLogin = value);
    storage.get("user.login").then((response) => {
      this.variables.setLogin(response);
      if (response) {
        this.logTitle = "Logout";
      } else {
        this.logTitle = "Login"
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppSettingsPage');
  }

  loginOrLogout() {
    if (this.isLogin) {
      this.storage.set("user.login", false).then((res1) => {
        this.storage.set("user.data", {}).then((res2) => {
          this.variables.setLogin(false);
          Variables.user = {};
          this.navCtrl.setRoot(Categories, null);
        });
      });
    } else {
      this.navCtrl.setRoot(UserLoginPage, null);
    }
  }

  presentChangeLocationModal() {
    let changeLocationModal = this.modalCtrl.create(ChangeLocation);
    changeLocationModal.present();
    changeLocationModal.onDidDismiss((data) => {
      if (data.success) {
        let alert = this.alertCtrl.create({
          title: 'Success',
          message: 'Location Changed. Your cart and the login data is reset.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                //ignore
              }
            }
          ]
        });
        alert.present();
      }
    });
  }
}
