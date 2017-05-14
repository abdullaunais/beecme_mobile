import { Component, ViewChildren } from '@angular/core';
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
  registerPressed: boolean = false;
  errorColored: boolean = false;
  validationArray: Array<any> = [];

  @ViewChildren('forminput') formInputs;
  @ViewChildren('formitem') formItems;
  getItems = () => {
    console.log(this.formItems.toArray().map(x => x.nativeElement));
  }
  public registerForm = this.fb.group({
    formUsername: ["", [Validators.required, Validators.minLength(4)]],
    formEmail: ["", [Validators.required, Validators.minLength(6), Validators.email]],
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
              } else if (response.code < 0) {
                if (response.message === "Request failed. Code already exists") {
                  let prompt = this.alertCtrl.create({
                    title: 'Already Registered',
                    message: "This email is already been registered. Login with your account instead?",
                    cssClass: 'alert-style',
                    buttons: [
                      {
                        text: 'Cancel',
                        cssClass: 'alert-button-danger',
                        handler: data => {
                        }
                      },
                      {
                        text: 'Login',
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
                } else {
                  let prompt = this.alertCtrl.create({
                    title: 'Registeration Failed',
                    message: response.message,
                    cssClass: 'alert-style',
                    buttons: [
                      {
                        text: 'OK',
                        cssClass: 'alert-button-danger',
                        handler: data => {
                        }
                      }
                    ]
                  });
                  prompt.present();
                }
              } else {
                let prompt = this.alertCtrl.create({
                  title: 'Registration Failed',
                  message: "Something went wrong when registering your account.",
                  cssClass: 'alert-style',
                  buttons: [
                    {
                      text: 'OK',
                      cssClass: 'alert-button-danger',
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

  registerClick() {
    this.registerPressed = true;
  }

  inputBlur() {
    if (this.errorColored) {
      this.validate();
    }
  }

  validate() {
    // console.log(event);
    // console.log(this.registerForm.value);
    // console.log(this.registerForm);

    let isValid: boolean = true;
    let message: string = "";
    let formIndex: number = 0;
    this.validationArray = [];
    console.log(this.formItems['_results']);
    if (this.registerForm.controls.formUsername.errors) {
      if (this.registerForm.controls.formUsername.errors.required) {
        isValid = false;
        message = "Name is required";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formUsername.errors.minlength) {
        isValid = false;
        message = "Name should be at least 4 charaters long";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    if (this.registerForm.controls.formEmail.errors) {
      if (this.registerForm.controls.formEmail.errors.required) {
        isValid = false;
        message = "Email is required";
        formIndex = 1;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });

      } else if (this.registerForm.controls.formEmail.errors.minlength) {
        isValid = false;
        message = "Email is not a valid format";
        formIndex = 1;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formEmail.errors.email) {
        isValid = false;
        message = "Email is not a valid format";
        formIndex = 1;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    if (this.registerForm.controls.formPhone.errors) {
      if (this.registerForm.controls.formPhone.errors.required) {
        isValid = false;
        message = "Phone is required";
        formIndex = 2;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formPhone.errors.minlength) {
        isValid = false;
        message = "Phone should be at least 9 charaters long";
        formIndex = 2;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }


    if (this.registerForm.controls.formPassword.errors) {
      if (this.registerForm.controls.formPassword.errors.required) {
        isValid = false;
        message = "Password is required";
        formIndex = 3;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formPassword.errors.minlength) {
        isValid = false;
        message = "Password should be at least 6 charaters long";
        formIndex = 3;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    if (this.registerForm.controls.formAddress1.errors) {
      if (this.registerForm.controls.formAddress1.errors.required) {
        isValid = false;
        message = "Address is required";
        formIndex = 4;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formAddress1.errors.minlength) {
        isValid = false;
        message = "Address is invalid";
        formIndex = 4;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    // console.log(this.registerPressed);
    if (!isValid) {
      if (this.registerPressed) {
        this.presentToast(this.validationArray[0]['message'], 2000);

        setTimeout(() => {
          this.formInputs.toArray()[parseInt(this.validationArray[0].index)].setFocus();
        }, 500);
      }
      let elemArray: Array<any> = this.formItems['_results'];
      elemArray.forEach((elem) => {
        elem['_elementRef']['nativeElement'].style.backgroundColor = '#fff';
      });
      this.validationArray.forEach((validation, index) => {
        elemArray[validation.index]['_elementRef']['nativeElement'].style.backgroundColor = '#fcc';
      });
      this.errorColored = true;
      this.registerPressed = false;
      return;
    } else {
      this.username = this.registerForm.value.formUsername;
      this.email = this.registerForm.value.formEmail;
      this.phone = this.registerForm.value.formPhone;
      this.password = this.registerForm.value.formPassword;
      this.address1 = this.registerForm.value.formAddress1;
      this.address2 = this.registerForm.value.formAddress2;
      if (this.registerPressed) {
        this.registerUser();
      }
      return;
    }
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
      duration: duration,
      position: 'top'
    });
    toast.present();
  }
}