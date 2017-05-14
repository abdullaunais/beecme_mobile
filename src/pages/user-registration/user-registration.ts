import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { Geolocation } from '@ionic-native/geolocation';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

/*
  Generated class for the UserRegistration page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-user-registration',
  templateUrl: 'user-registration.html',
  providers: [UserService, Geolocation, ReactiveFormsModule]
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

  public registerForm = this.fb.group({
    formUsername: ["", [Validators.required, Validators.minLength(4)]],
    formEmail: ["", [Validators.required, Validators.minLength(6)]],
    formPhone: ["", [Validators.required, Validators.minLength(9)]],
    formPassword: ["", [Validators.required, Validators.minLength(6)]],
    formAddress1: ["", [Validators.required, Validators.minLength(2)]],
    formAddress2: ["", []],
  });
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    storage: Storage,
    userService: UserService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    public fb: FormBuilder,
    public toastCtrl: ToastController
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

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.info("Latitude -- ", resp.coords.latitude);
      this.latitude = resp.coords.latitude;
      console.info("Longitude -- ", resp.coords.longitude);
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  goToLogin() {
    this.navCtrl.setRoot('UserLoginPage', null, { animate: true, direction: "forward" });
  }

  registerUser() {
    let alert = this.alertCtrl.create({
      title: 'Confim Signup',
      message: 'Do you wish to proceed signup?',
      cssClass: 'alert-style',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-danger-plain',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          cssClass: 'alert-button-primary',
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

              if (response.code === 1) {
                // register success
                let prompt = this.alertCtrl.create({
                  title: 'Registration Success',
                  message: "Please Login with the details provided.",
                  cssClass: 'alert-style',
                  buttons: [
                    {
                      text: 'OK',
                      cssClass: 'alert-button-success',
                      handler: data => {
                        if (this.redirectString === "redirect-deliveryschedule") {
                          this.navCtrl.push('UserLoginPage', "redirect-deliveryschedule");
                        } else {
                          this.navCtrl.push('UserLoginPage', null);
                        }
                      }
                    }
                  ]
                });
                prompt.present();
              } else if(response.message === "User already registered with this email") {
                // user already registered
                let prompt = this.alertCtrl.create({
                  title: 'Already Registered',
                  message: "This email is already been registered. Login with your account instead.",
                  cssClass: 'alert-ui-theme-success',
                  buttons: [
                    {
                      text: 'Chnage Email',
                      handler: data => {
                      }
                    },
                    {
                      text: 'Login',
                      handler: data => {
                        if (this.redirectString === "redirect-deliveryschedule") {
                          this.navCtrl.push('UserLoginPage', "redirect-deliveryschedule");
                        } else {
                          this.navCtrl.push('UserLoginPage', null);
                        }
                      }
                    }
                  ]
                });
                prompt.present();
              } else {
                let prompt = this.alertCtrl.create({
                  title: 'Registration Failed',
                  message: "Something went wrong when registering your account.",
                  cssClass: 'alert-ui-theme-danger',
                  buttons: [
                    {
                      text: 'OK',
                      handler: data => {
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

  doRegister(event) {
    // console.log(event);
    // console.log(this.registerForm.value);
    // console.log(this.registerForm);
    if (this.registerForm.controls.formUsername.errors) {
      if (this.registerForm.controls.formUsername.errors.required) {
        this.presentToast("Username is required", 2000);
        return;
      } else if (this.registerForm.controls.formUsername.errors.minlength) {
        this.presentToast("Username should be at least 4 charaters long", 2000);
        return;
      }
    }

    if (this.registerForm.controls.formEmail.errors) {
      if (this.registerForm.controls.formEmail.errors.required) {
        this.presentToast("Email is required", 2000);
        return;
      } else if (this.registerForm.controls.formEmail.errors.minlength) {
        this.presentToast("Email is not a valid format", 2000);
        return;
      }
    }

    if (this.registerForm.controls.formPhone.errors) {
      if (this.registerForm.controls.formPhone.errors.required) {
        this.presentToast("Phone is required", 2000);
        return;
      } else if (this.registerForm.controls.formPhone.errors.minlength) {
        this.presentToast("Phone should be at least 9 charaters long", 2000);
        return;
      }
    }


    if (this.registerForm.controls.formPassword.errors) {
      if (this.registerForm.controls.formPassword.errors.required) {
        this.presentToast("Password is required", 2000);
        return;
      } else if (this.registerForm.controls.formPassword.errors.minlength) {
        this.presentToast("Password should be at least 6 charaters", 2000);
        return;
      }
    }

    if (this.registerForm.controls.formAddress1.errors) {
      if (this.registerForm.controls.formAddress1.errors.required) {
        this.presentToast("Address is required", 2000);
        return;
      } else if (this.registerForm.controls.formAddress1.errors.minlength) {
        this.presentToast("Address is Invalid", 2000);
        return;
      }
    }
    this.username = this.registerForm.value.formUsername;
    this.email = this.registerForm.value.formEmail;
    this.phone = this.registerForm.value.formPhone;
    this.password = this.registerForm.value.formPassword;
    this.address1 = this.registerForm.value.formAddress1;
    this.address2 = this.registerForm.value.formAddress2;

    this.registerUser();
    return;
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

  presentToast(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'OK',
      duration: duration
    });
    toast.present();
  }

}