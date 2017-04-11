import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DeliveryService } from "../../providers/delivery-service";
import { Storage } from '@ionic/storage';
import { Categories } from "../categories/categories";
import { Variables } from "../../providers/variables";

/*
  Generated class for the OrderSummary page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-summary',
  templateUrl: 'order-summary.html',
  providers: [DeliveryService]
})
export class OrderSummaryPage {
  deliverySchedule: any;
  totalAmount: number;

  storage: Storage;
  loading: any;
  deliveryService: DeliveryService;
  checkoutComment: string = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    deliveryService: DeliveryService,
    storage: Storage,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private variables: Variables
  ) {
    this.deliveryService = deliveryService;
    this.storage = storage;
    this.totalAmount = 0;
    this.deliverySchedule = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSummaryPage');
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
            "dlvSchId": this.deliverySchedule.dlvSchId,
            "totalAmount": this.totalAmount,
            "email": user.email,
            "comment": this.checkoutComment
          },
          "orderDetails": cartItems
        }
        this.deliveryService.addOrder(order, user.authToken).then((data) => {
          let json = JSON.stringify(data);
          let response = JSON.parse(json);
          this.hideLoading();

          if (response['_body'] === "Shopping cart is added and ready to deliver") {
            let alert = this.alertCtrl.create({
              title: 'Success',
              message: response['_body'],
              cssClass: 'alert-ui-theme-success',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    this.storage.set('delivery.cart', []).then((cart) => {
                      this.storage.set('delivery.cartCount', 0).then((count) => {
                        this.navCtrl.setRoot(Categories, null);
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

          
        }, (err) => {
          console.log(err);
          this.hideLoading();
        });
      });
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

}
