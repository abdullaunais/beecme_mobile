import { Component, ViewChildren } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, IonicPage, ToastController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

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

  userService: UserService;

  email: string;
  password: any;

  redirectString: string;
  storage: Storage;
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
    userService: UserService,
    storage: Storage,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public fb: FormBuilder,
    private variables: Variables,
    public toastCtrl: ToastController
  ) {
    this.userService = userService;
    this.storage = storage;
    this.redirectString = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLoginPage');
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
    this.navCtrl.setRoot('UserRegistrationPage', this.redirectString, { animate: true, direction: "forward" });
  }

  loginUser() {
    console.info(this.email);
    console.info(this.password);
    if (!this.email && !this.password) {
      return;
    }

    this.showLoading("Logging in...")
    this.userService.authenticate(this.email, this.password).then((data) => {
      let json = JSON.stringify(data);
      let response = JSON.parse(json);
      // let capitalizeFirstChar = (string) => { return string.charAt(0).toUpperCase() + string.substring(1) };

      console.log(response);
      if (response.status === 201 || response.status === 200) {
        // login success
        // this.storage.get('user.data').then((user) => {
        // });
        let userData = JSON.parse(response['_body']);
        console.info(userData);
        this.storage.set("user.data", userData);
        this.storage.set("user.login", true);
        this.variables.setLogin(true);
        Variables.user.username = userData.username;
        Variables.user.email = userData.email;

        this.hideLoading();

        if (this.redirectString === "redirect-deliveryschedule") {
          this.navCtrl.push('DeliverySchedulePage', "login-success", { animate: true, direction: "forward" });
        } else {
          this.navCtrl.setRoot('Categories', null, { animate: true, direction: "forward" });
        }
      } else if (JSON.parse(response['_body']).message === "invalid credentials") {
        this.hideLoading();
        let alert = this.alertCtrl.create({
          title: this.toTitleCase(JSON.parse(response['_body']).message),
          message: 'Please check your login details',
          cssClass: 'alert-style',
          buttons: [
            {
              text: 'OK',
              cssClass: 'alert-button-danger',
              handler: () => {
                //ignore
              }
            }
          ]
        });
        alert.present();
      } else {
        this.hideLoading();
        let alert = this.alertCtrl.create({
          title: "Login Error",
          message: 'Error occurred while logging in.',
          cssClass: 'alert-style',
          buttons: [
            {
              text: 'OK',
              cssClass: 'alert-button-danger',
              handler: () => {
                //ignore
              }
            }
          ]
        });
        alert.present();
      }
    }, (err) => {
      console.log(err);
      this.hideLoading();
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
      if (this.loginForm.controls.formEmail.errors.required) {
        isValid = false;
        message = "Email is required";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.loginForm.controls.formEmail.errors.minlength) {
        isValid = false;
        message = "Email is not a valid format";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.loginForm.controls.formEmail.errors.email) {
        isValid = false;
        message = "Email is not a valid format";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    if (this.loginForm.controls.formPassword.errors) {
      if (this.loginForm.controls.formPassword.errors.required) {
        isValid = false;
        message = "Password is required";
        formIndex = 1;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.loginForm.controls.formPassword.errors.minlength) {
        isValid = false;
        message = "Password should be at least 6 charaters long";
        formIndex = 1;
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
}
