import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the UserProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {
  user: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, storage: Storage) {

    storage.get("user.login").then((login) => {
      if(login) {
        storage.get("user.data").then((userData) => {
          this.user = userData;
        })
      } else {
        // redirect to login
      }
    });
    // let alert = this.alertCtrl.create({
    //   title: 'Message',
    //   message: 'Still in Development. Will be available soon.',
    //   cssClass: 'alert-ui-theme-success',
    //   buttons: [
    //     {
    //       text: 'OK',
    //       handler: () => {
    //         //ignore
    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

}
