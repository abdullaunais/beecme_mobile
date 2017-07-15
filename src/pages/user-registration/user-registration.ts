import { Component, ViewChildren } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
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
  providers: [UserService, ReactiveFormsModule]
})
export class UserRegistrationPage {
  username: string;
  email: string;
  phone: string;
  password: any;

  city: any;
  province: any;
  country: any;

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
    formPhone: ["", [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
    formPassword: ["", [Validators.required, Validators.minLength(6)]],
  });
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private userService: UserService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    public toastCtrl: ToastController
  ) {
    this.redirectString = navParams.data;
    this.storage.get('location.city').then((city) => {
      this.city = city;
      this.storage.get('location.province').then((province) => {
        this.province = province;
        this.storage.get('location.country').then((country) => {
          this.country = country;
        });
      });
    });
  }

  goToLogin() {
    this.navCtrl.pop();
  }

  registerUser() {
    let confirmAlert = this.alertCtrl.create({
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
            this.showLoading("Registering...")
            let user = {
              "username": this.username,
              "email": this.email,
              "password": this.password,
              "phone": this.phone,
              "country": this.country.id,
              "province": this.province.id,
              "city": this.city.id,
              "type": "1",
              "notificationSend": "0"
            };
            this.userService.registerUser(user).then((data) => {
              let json = JSON.stringify(data);
              let response = JSON.parse(json);
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
                          let navTransition = prompt.dismiss();
                          if (this.redirectString === "redirect-deliveryschedule") {
                            navTransition.then(() => {
                              this.navCtrl.push('UserLoginPage', "redirect-deliveryschedule");
                            });
                          } else {
                            navTransition.then(() => {
                              this.navCtrl.push('UserLoginPage', null);
                            });
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
    confirmAlert.present();
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
      isValid = false;
      formIndex = 1;
      if (this.registerForm.controls.formEmail.errors.required) {
        message = "Email is required";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formEmail.errors.minlength) {
        message = "Email is not a valid format";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formEmail.errors.email) {
        message = "Email is not a valid format";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    if (this.registerForm.controls.formPhone.errors) {
      isValid = false;
      formIndex = 2;
      if (this.registerForm.controls.formPhone.errors.required) {
        message = "Phone is required";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formPhone.errors.minlength) {
        message = "Phone should have at least 9 numbers";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formPhone.errors.maxlength) {
        message = "Phone cannot be more than 10 numbers";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }


    if (this.registerForm.controls.formPassword.errors) {
      isValid = false;
      formIndex = 3;
      if (this.registerForm.controls.formPassword.errors.required) {
        message = "Password is required";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.registerForm.controls.formPassword.errors.minlength) {
        message = "Password should be at least 6 charaters long";
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
      this.username = this.registerForm.value.formUsername.replace(/[^A-Za-z0-9_'-]/gi, '');
      this.email = this.registerForm.value.formEmail;
      this.phone = this.registerForm.value.formPhone;
      this.password = this.registerForm.value.formPassword;

      if (this.registerPressed) {
        this.registerUser();
      }
      return;
    }
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