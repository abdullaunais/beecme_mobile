import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { Geolocation } from 'ionic-native';
import { UserLoginPage } from "../user-login/user-login";

/*
  Generated class for the UserRegistration page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-registration',
  templateUrl: 'user-registration.html',
  providers: [UserService]
})
export class UserRegistrationPage {
  countryCode: string = "sa";
  latitude: any;
  longitude: any;
  username: string;
  email: string;
  phone: string;
  password: any;
  address1: string;
  address2: string;

  city: any;
  province: any;
  country: any;

  storage: Storage;
  userService: UserService;
  loading: any;
  redirectString: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    storage: Storage,
    userService: UserService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.storage = storage;
    this.userService = userService;
    this.redirectString = navParams.data;
    storage.get('location.city').then((city) => {
      if (city) {
        this.city = city;
        storage.get('location.province').then((province) => {
          if (province) {
            this.province = province;
            storage.get('location.country').then((country) => {
              if (country) {
                this.country = country;
              }
            });
          }
        });
      }
    });

    Geolocation.getCurrentPosition().then((resp) => {
      console.info("Latitude -- ", resp.coords.latitude);
      this.latitude = resp.coords.latitude;
      console.info("Longitude -- ", resp.coords.longitude);
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  goToLogin() {
    this.navCtrl.pop();
  }

  registerUser() {
    let alert = this.alertCtrl.create({
      title: 'Confim Signup',
      message: 'Do you wish to proceed signup?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.showLoading("Registering...")
            let user = {
              "username": this.username,
              "email": this.email,
              "password": this.password,
              "phone": this.phone,
              "address": this.address1 + " " + this.address2,
              "country": this.country.id,
              "province": this.province.id,
              "city": this.city.id,
              "longitude": this.longitude,
              "latitude": this.latitude,
              "type": "1",
              "notificationSend": "0"
            };
            this.userService.registerUser(user).then((data) => {
              let json = JSON.stringify(data);
              let response = JSON.parse(json);
              // this.rows = Array.from(Array(Math.ceil(this.categories.length / 2)).keys());
              console.info(response);
              this.storage.set('user.data', user);
              this.storage.set('user.login', true);
              this.hideLoading();

              if (response.message === "Thank you for registering with Beecme") {
                // register success
                let prompt = this.alertCtrl.create({
                  title: 'Registration Success',
                  message: "Please Login with the details provided.",
                  buttons: [
                    {
                      text: 'OK',
                      handler: data => {
                        if(this.redirectString === "redirect-deliveryschedule") {
                          this.navCtrl.push(UserLoginPage, "redirect-deliveryschedule");
                        } else {
                          this.navCtrl.push(UserLoginPage, null);
                        }
                      }
                    }
                  ]
                });
                prompt.present();
              }
            }, (err) => {
              this.hideLoading();
              console.log("Error - ", err);
            });
          }
        }
      ]
    });
    alert.present();
  }


  validate() {
    // implement validation
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegistrationPage');
  }

  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      content: content,
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

}