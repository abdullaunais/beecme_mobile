import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserRegisterConfirmationPage } from '../user-register-confirmation/user-register-confirmation'
// import { Geolocation } from 'ionic-native';

/*
  Generated class for the UserRegistration page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-registration',
  templateUrl: 'user-registration.html'
})
export class UserRegistrationPage {
  countryCode: string = "sa";
  latitude: any;
  longitude: any;
  username: string;
  phone: string;
  password: any;
  address1: string;
  address2: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Geolocation.getCurrentPosition().then((resp) => {
    //   console.info("Latitude -- ", resp.coords.latitude);
    //   console.info("Longitude -- ", resp.coords.longitude);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }

  registerUser() {
    console.info(this.username + "/" + this.phone + "/" + this.password + "/" + this.address1 + "/" + this.address2);
    this.validate();
    this.navCtrl.push(UserRegisterConfirmationPage, {
      'username': this.username,
      'phone': this.phone,
      'address1' : this.address1,
      'address2' : this.address2
    });
    // this.navCtrl.push();
  }

  validate() {
    // implement validation
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegistrationPage');
  }

}