import { Component, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from "../../../providers/user-service";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  providers: [UserService]
})
export class ForgotPasswordPage {

  email: string;

  forgotPressed: boolean = false;
  errorColored: boolean = false;
  redirectString: string;

  loading: any;
  validationArray: Array<any> = [];
  @ViewChildren('forminput') formInputs;
  @ViewChildren('formitem') formItems;
  getItems = () => {
    console.log(this.formItems.toArray().map(x => x.nativeElement));
  }
  public forgotPwdForm = this.fb.group({
    formEmail: ["", [Validators.required, Validators.minLength(6), Validators.email]],
    formPassword: ["", [Validators.required, Validators.minLength(6)]]
  });

  constructor
    (
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    public fb: FormBuilder,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
    ) {
    this.email = navParams.data.email;
    this.redirectString = navParams.data.redirectString;
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ForgotPasswordPage');
  // }


  forgotClick() {
    this.forgotPressed = true;
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

    if (this.forgotPwdForm.controls.formEmail.errors) {
      if (this.forgotPwdForm.controls.formEmail.errors.required) {
        isValid = false;
        message = "Email is required";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.forgotPwdForm.controls.formEmail.errors.minlength) {
        isValid = false;
        message = "Email is not a valid format";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      } else if (this.forgotPwdForm.controls.formEmail.errors.email) {
        isValid = false;
        message = "Email is not a valid format";
        formIndex = 0;
        this.validationArray.push({ message: message, valid: isValid, index: formIndex });
      }
    }

    // console.log(this.loginPressed);
    if (!isValid) {
      if (this.forgotPressed) {
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
      this.forgotPressed = false;
      return;
    } else {
      this.email = this.forgotPwdForm.value.formEmail;
      if (this.forgotPressed) {
        this.sendForGotRequest();
      }
      return;
    }
  }

  sendForGotRequest() {
    this.showLoading("Requesting...");
    this.userService.forgotPassword(this.email).then((data) => {
      let json = JSON.stringify(data);
      let response = JSON.parse(json);

      if(response.code === -1) {
        let alert = this.alertCtrl.create({
          title: "Email not registered",
          message: 'The email you entered is not registered with our system. You can create a new account with this email, or enter a different email.',
          cssClass: 'alert-style',
          buttons: [
            {
              text: 'Register',
              // cssClass: 'alert-button-primary',
              handler: () => {
                //ignore
                this.navCtrl.push('UserRegistrationPage', this.redirectString);
              }
            },
            {
              text: 'OK',
              cssClass: 'alert-button-primary',
              role: 'cancel',
              handler: () => {
                //ignore
              }
            }
          ]
        });
        alert.present();
      }

      console.log(response);

      this.hideLoading();
    });
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
