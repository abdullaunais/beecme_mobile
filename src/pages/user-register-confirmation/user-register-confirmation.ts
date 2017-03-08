import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the UserRegisterConfirmation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-register-confirmation',
  templateUrl: 'user-register-confirmation.html'
})
export class UserRegisterConfirmationPage {
  username: string;
  phone: string;
  address1: string;
  address2: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.username = navParams.get('username');
    this.phone = navParams.get('phone');
    this.address1 = navParams.get('address1');
    this.address2 = navParams.get('address2');
    console.info("User Details", this.username + this.phone + this.address1 + this.address2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterConfirmationPage');
  }

}
