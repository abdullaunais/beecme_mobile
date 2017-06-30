import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, IonicPage, ToastController } from 'ionic-angular';
import { DeliveryService } from "../../providers/delivery-service";
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";
import { Subscription } from "rxjs/Subscription";

/*
  Generated class for the OrderSummary page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-order-summary',
  templateUrl: 'order-summary.html',
  providers: [DeliveryService]
})
export class OrderSummaryPage {
  cartShop: any = {};
  user: any = {};
  userAddressElement: string;
  cartItems: Array<any> = [];
  isLoading: boolean;
  totalAmount: number;

  loading: any;
  checkoutComment: string = "";
  watchCart: Subscription;
  cartCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private deliveryService: DeliveryService,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private variables: Variables
  ) {
    this.totalAmount = 0;
    this.checkoutComment = navParams.data.comment;
    this.initialize();
  }

  initialize() {
    this.isLoading = true;
    this.storage.get('delivery.cart').then((cart) => {
      // console.info(cart);
      if (cart) {
        if (cart.length > 0) {
          this.cartItems = cart;
          this.cartItems.forEach((item) => {
            this.totalAmount = this.totalAmount + (item.price * item.quantity);
          })
        } else {
          this.cartItems = [];
        }
      }
      this.isLoading = false;
      this.storage.get('delivery.cartShop').then((cartShop) => {
        this.cartShop = cartShop;
        console.log(this.cartShop);
      });
      this.storage.get('user.data').then((user) => {
        this.user = user;
        this.userAddressElement = user.address.replace(/(?:\r\n|\r|\n)/g, '<br />');
      });
    });
  }

  ionViewWillEnter() {
    this.watchCart = this.variables.cartCount.subscribe(value => this.cartCount = value);
  }

  ionViewWillLeave() {
    this.watchCart.unsubscribe();
  }

  confirmOrder() {
    this.showLoading("Placing Order...");
    this.checkoutComment = Variables.checkoutComment;
    this.storage.get('delivery.cart').then((cart) => {
      let cartItems: Array<any> = cart;
      cartItems.forEach((item) => {
        this.totalAmount = this.totalAmount + (item.price * item.quantity);
      })

      this.storage.get('user.data').then((user) => {
        let order = {
          "orderHeader": {
            // "dlvSchId": this.deliverySchedule.dlvSchId,
            "totalAmount": this.totalAmount + this.cartShop.deliveryCharge,
            "userId": user.userId,
            "shopId": this.cartShop.userId,
            "comment": this.checkoutComment,
            "currency": this.cartShop.currency,

          },
          "orderDetails": cartItems
        }
        this.deliveryService.addOrder(order, user.authToken).then((data) => {
          let json = JSON.stringify(data);
          let response = JSON.parse(json);
          this.hideLoading();

          if (response.code === 1) {
            let alert = this.alertCtrl.create({
              title: 'Success',
              message: response.message,
              cssClass: 'alert-style',
              buttons: [
                {
                  text: 'OK',
                  cssClass: 'alert-button-success',
                  handler: () => {
                    this.storage.set('delivery.cart', []).then((cart) => {
                      this.storage.set('delivery.cartCount', 0).then((count) => {
                        this.variables.setCartCount(0);
                        this.navCtrl.setRoot('Categories', null);
                      });
                    });
                  }
                }
              ]
            });
            alert.present();
          } else {
            // fail
            let alert = this.alertCtrl.create({
              title: 'Failed',
              message: "Error occurred while placing order",
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                  }
                }
              ]
            });
            alert.present();
          }
        }).catch(err => {
          this.presentToast("Error occurred in order placement", 2000);
        });
      });
    });
  }

  openCart() {
    this.navCtrl.push('CartPage', null);
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

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }
}
