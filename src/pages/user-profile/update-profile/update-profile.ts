import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, IonicPage, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../../../providers/user-service";
import { StatusBar } from "@ionic-native/status-bar";

/**
 * Generated class for the ChangeLocation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html',
  providers: [UserService]
})
export class UpdateProfile {
  loading: any;
  user: any = {};
  updateProperty: string;
  authToken: any;

  public usernameForm = this.fb.group({
    formUsername: ["", [Validators.required, Validators.minLength(4)]]
  });
  public phoneForm = this.fb.group({
    formPhone: ["", [Validators.required, Validators.minLength(9)]]
  });

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    private userService: UserService,
    private statusBar: StatusBar
  ) {
    this.user = navParams.data.user;
    this.updateProperty = navParams.data.property;
    storage.get("user.authToken").then(token => {
      this.authToken = token;
    });
    if (this.updateProperty === "Name") {
      this.statusBar.backgroundColorByHexString('#1557c7');
    } else if (this.updateProperty === "Phone") {
      this.statusBar.backgroundColorByHexString('#0ec343');
    }
    this.usernameForm.setValue({
      formUsername: this.user.username
    });
    this.phoneForm.setValue({
      formPhone: this.user.phone
    });
  }

  ionViewDidEnter() {
    this.viewCtrl.showBackButton(true);
  }

  ionViewWillLeave() {
    this.statusBar.backgroundColorByHexString('#4527A0');
  }

  validateName() {
    let isValid: boolean = true;
    let message: string = "";

    if (this.usernameForm.controls.formUsername.errors) {
      if (this.usernameForm.controls.formUsername.errors.required) {
        isValid = false;
        message = "Name is required";
      } else if (this.usernameForm.controls.formUsername.errors.minlength) {
        isValid = false;
        message = "Name should be at least 2 charaters long";
      }
    }

    if (!isValid) {
      this.presentToast(message, 2000);
      return;
    } else {
      delete this.user.password;
      this.user.username = this.usernameForm.value.formUsername;
      this.updateUser();
    }
  }

  validatePhone() {
    let isValid: boolean = true;
    let message: string = "";

    if (this.phoneForm.controls.formPhone.errors) {
      if (this.phoneForm.controls.formPhone.errors.required) {
        isValid = false;
        message = "Phone is required";
      } else if (this.phoneForm.controls.formPhone.errors.minlength) {
        isValid = false;
        message = "Phone should be at least 9 charaters long";
      }
    }

    if (!isValid) {
      this.presentToast(message, 2000);
      return;
    } else {
      delete this.user.password;
      this.user.phone = this.phoneForm.value.formPhone;
      this.updateUser();
    }
  }

  cancelView() {
    this.statusBar.backgroundColorByHexString('#4527A0');
    this.viewCtrl.dismiss({ success: false });
  }

  updateUser() {
    this.showLoading("Updating...");
    this.userService.updateUser(this.user, this.authToken).then(res => {
      if (res.code === 1) {
        this.userService.getUserDetails(this.user.userId, this.authToken).then(data => {
          let json = JSON.stringify(data);
          this.user = JSON.parse(json);
          this.hideLoading();
          this.viewCtrl.dismiss({ user: this.user, success: true });
        }).catch(err => {
          this.presentToast("Something went wrong", 2000);
          this.hideLoading();
          this.viewCtrl.dismiss({ success: false });
        });
      } else {
        this.presentToast("Error updating " + this.updateProperty, 2000);
        this.hideLoading();
        this.viewCtrl.dismiss({ success: false });
      }
    }).catch(err => {
      this.presentToast("Error updating " + this.updateProperty, 2000);
      this.hideLoading();
      this.viewCtrl.dismiss({ success: false });
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
      position: 'bottom'
    });
    toast.present();
  }
}
