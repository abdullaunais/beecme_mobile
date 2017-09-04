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
  cartItems: Array<any> = [];
  isLoading: boolean;
  totalAmount: number;

  loading: any;
  checkoutComment: string = "";
  address: any;
  userAddressElement: any;
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
    this.address = navParams.data.address;
    let addressElemObj = this.address.street + ",\n" + navParams.data.city.nameEn + ",  " + navParams.data.province.nameEn + ",\n" + navParams.data.country.nameEn
    this.userAddressElement = addressElemObj.replace(/(?:\r\n|\r|\n)/g, '<br />');
    this.initialize();
  }

  initialize() {
    this.isLoading = true;
    this.storage.get('user.data').then(user => {
      this.user = user;
      this.storage.get('delivery.cart').then(cart => {
        if (cart) {
          if (cart.length > 0) {
            this.cartItems = cart;
            this.cartItems.forEach((item) => {
              this.totalAmount = this.totalAmount + (item.price * item.quantity);
            });
          } else {
            this.cartItems = [];
          }
        }
        this.storage.get('delivery.cartShop').then(cartShop => {
          this.cartShop = cartShop;
          this.isLoading = false;
        }).catch(shopErr => {
          this.isLoading = false;
        });
      }).catch(err => {
        this.isLoading = false;
      });
    }).catch(usrErr => {
      this.isLoading = false;
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
    this.storage.get('delivery.cart').then((cart) => {
      let cartItems: Array<any> = cart;
      cartItems.forEach((item) => {
        this.totalAmount = this.totalAmount + (item.price * item.quantity);
      });

      let order = {
        "dlvAddressReq": {
          cityId: this.address.cityId,
          provinceId: this.address.provinceId,
          countryId: this.address.countryId,
          nickName: this.address.nickName,
          street: this.address.street,
        },
        "orderHeaderReq": {
          // "dlvSchId": this.deliverySchedule.dlvSchId,
          "totalAmount": this.totalAmount + this.cartShop.deliveryCharge,
          "userId": this.user.userId,
          "shopId": this.cartShop.shopId,
          "comment": this.checkoutComment,
          "currency": this.cartShop.currency,
        },
        "orderDetailsReq": cartItems
      }
      this.deliveryService.addOrder(order, this.user.authToken).then((data) => {
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
                      this.storage.set('delivery.cartShop', {}).then((shop) => {
                        this.variables.setCartCount(0);
                        this.navCtrl.setRoot('Categories', null);
                      });
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
