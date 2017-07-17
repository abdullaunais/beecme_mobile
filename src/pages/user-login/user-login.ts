import { Component, ViewChildren } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, IonicPage, ToastController, Events } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";
import { FormBuilder, Validators } from '@angular/forms';

/*
  Generated class for the UserLogin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
  providers: [UserService]
})
export class UserLoginPage {
  email: string;
  password: any;

  redirectString: string;
  loading: any;

  loginPressed: boolean = false;
  errorColored: boolean = false;
  validationArray: Array<any> = [];
  @ViewChildren('forminput') formInputs;
  @ViewChildren('formitem') formItems;
  getItems = () => {
    console.log(this.formItems.toArray().map(x => x.nativeElement));
  }
  public loginForm = this.fb.group({
    formEmail: ["", [Validators.required, Validators.minLength(6), Validators.email]],
    formPassword: ["", [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public fb: FormBuilder,
    private variables: Variables,
    public toastCtrl: ToastController,
    public events: Events
  ) {
    this.redirectString = navParams.data.redirect;
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

  goToRegister() {
    this.navCtrl.push('UserRegistrationPage', this.redirectString, { animate: true, direction: "forward" });
  }

  loginUser() {
    if (!this.email && !this.password) {
      return;
    }

    this.showLoading("Logging in...")
    this.userService.authenticate(this.email, this.password).then((data) => {
      let json = JSON.stringify(data);
      let response = JSON.parse(json);

      let userData = response;
      console.info(userData);
      this.storage.set("user.login", true).then(res1 => {
        this.storage.set("user.data", userData).then(res2 => {
          this.storage.set("user.authToken", userData.authToken).then(res3 => {
            this.variables.setLogin(true);
            Variables.user.username = userData.username;
            Variables.user.email = userData.email;

            this.hideLoading();

            this.events.publish("user:change");
            if (this.redirectString === "redirect-deliveryschedule") {
              this.navCtrl.setRoot('CheckoutOptionsPage', null, { animate: true, direction: "forward" });
            } else if (this.redirectString === "redirect-accountpage") {
              this.navCtrl.setRoot('UserProfilePage', null, { animate: true, direction: "forward" });
            } else if (this.redirectString === "redirect-orderhistory") {
              this.navCtrl.setRoot('OrderHistoryPage', null, { animate: true, direction: "forward" });
            } else {
              this.navCtrl.setRoot('Categories', null, { animate: true, direction: "forward" });
            }
          });
        });
      });
    }).catch(err => {
      if (err.status === 401) {
        this.hideLoading();
        let alert = this.alertCtrl.create({
          title: this.toTitleCase(JSON.parse(err['_body']).message),
          message: 'Please check your login details',
          cssClass: 'alert-style',
          buttons: [
            {
              text: 'OK',
              cssClass: 'alert-button-danger',
              handler: () => {
                this.hideLoading();
              }
            }
          ]
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: "Login Error",
          message: 'Error occurred while logging in.',
          cssClass: 'alert-style',
          buttons: [
            {
              text: 'OK',
              cssClass: 'alert-button-danger',
              handler: () => {
                this.hideLoading();
              }
            }
          ]
        });
        alert.present();
      }
    });
  }

  loginClick() {
    this.loginPressed = true;
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }

  inputBlur() {
    if (this.errorColored) {
      this.validate();
    }
  }

  validate() {
    // console.log(event);
    // console.log(this.loginForm.value);
    // console.log(this.loginForm);

    let isValid: boolean = true;
    let message: string = "";
    let formIndex: number = 0;
    this.validationArray = [];
    // console.log(this.formItems['_results']);

    if (this.loginForm.controls.formEmail.errors) {
      isValid = false;
      formIndex = 0;
      if (this.loginForm.controls.formEmail.errors.required) {
        message = "Email is required";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.loginForm.controls.formEmail.errors.minlength) {
        message = "Email is not a valid format";;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.loginForm.controls.formEmail.errors.email) {
        message = "Email is not a valid format";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    if (this.loginForm.controls.formPassword.errors) {
      isValid = false;
      formIndex = 1;
      if (this.loginForm.controls.formPassword.errors.required) {
        message = "Password is required";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.loginForm.controls.formPassword.errors.minlength) {
        message = "Password should be at least 6 charaters long";
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    // console.log(this.loginPressed);
    if (!isValid) {
      if (this.loginPressed) {
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
      this.loginPressed = false;
      return;
    } else {
      this.email = this.loginForm.value.formEmail;
      this.password = this.loginForm.value.formPassword;
      if (this.loginPressed) {
        this.loginUser();
      }
      return;
    }
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

  forgotPwd() {
    if (this.email) {
      if (!this.loginForm.controls.formEmail.errors) {
        this.navCtrl.push('ForgotPasswordPage', { email: this.email, redirectString: this.redirectString })
      } else {
        this.navCtrl.push('ForgotPasswordPage', { email: "", redirectString: this.redirectString })
      }
    } else {
      this.navCtrl.push('ForgotPasswordPage', { email: "", redirectString: this.redirectString })
    }
  }
}
