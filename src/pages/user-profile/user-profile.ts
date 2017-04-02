import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/*
  Generated class for the UserProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    let alert = this.alertCtrl.create({
      title: 'Message',
      message: 'Still in Development. Will be available soon.',
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

}
