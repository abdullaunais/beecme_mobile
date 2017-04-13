import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { DeliverySchedulePage } from "../delivery-schedule/delivery-schedule";
import { Categories } from "../categories/categories";
import { UserRegistrationPage } from "../user-registration/user-registration";
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";

/*
  Generated class for the UserLogin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    userService: UserService,
    storage: Storage,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private variables: Variables
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
    this.navCtrl.push(UserRegistrationPage, this.redirectString)
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
      let responseMesage = JSON.parse(response['_body']).message;
      let capitalizeFirstChar = (string) => {return string.charAt(0).toUpperCase() + string.substring(1)};

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
          this.navCtrl.push(DeliverySchedulePage, "login-success");
        } else {
          this.navCtrl.setRoot(Categories);
        }
      } else {
        this.hideLoading();
        let alert = this.alertCtrl.create({
          title: capitalizeFirstChar(responseMesage),
          message: 'Please check your login details',
          cssClass: 'alert-ui-theme-danger',
          buttons: [
            {
              text: 'OK',
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

}
