import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, IonicPage, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Variables } from "../../providers/variables";

/*
  Generated class for the AppSettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@IonicPage()
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
    private alertCtrl: AlertController,
    public events: Events
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
  
  loginOrLogout() {
    if (this.isLogin) {
      this.storage.set("user.login", false).then((res1) => {
        this.storage.set("user.authToken", null).then((res2) => {
          this.storage.set("user.data", {}).then((res3) => {
            this.variables.setLogin(false);
            Variables.user = {};
            this.events.publish("user:change");
            this.navCtrl.setRoot('Categories', null);
          });
        });
      });
    } else {
      this.navCtrl.push('UserLoginPage', null);
    }
  }

  manageAddress() {
    this.navCtrl.push('ManageAddressPage');
  }

  presentChangeLocationModal() {
    let changeLocationModal = this.modalCtrl.create('ChangeLocation');
    changeLocationModal.present();
    changeLocationModal.onDidDismiss((data) => {
      if (data.success) {
        let alert = this.alertCtrl.create({
          title: 'Success',
          cssClass: 'alert-style',
          message: 'Location Changed. Your cart and the login data is reset.',
          buttons: [
            {
              text: 'OK',
              cssClass: 'alert-button-success',
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
