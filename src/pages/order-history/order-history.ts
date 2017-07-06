import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { DeliveryService } from "../../providers/delivery-service";
import { Storage } from '@ionic/storage';
/*
  Generated class for the OrderHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
  providers: [DeliveryService]
})
export class OrderHistoryPage {
  start: number = 0;
  offset: number = 20;

  orders: Array<any> = [];
  user: any = {};

  isLoading: boolean;
  noMoreItems: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private deliveryService: DeliveryService,
    private storage: Storage
  ) {
    this.initialize();
  }

  initialize() {
    this.isLoading = true;
    this.storage.get("user.data").then(user => {
      if (user.userId) {
        this.user = user;
        this.deliveryService.getOrders(this.user.userId, this.start, this.offset).then(orderRes => {
          if (orderRes['cartlist']) {
            if (orderRes['cartlist'].length > 0) {
              this.orders = orderRes['cartlist'];
              console.log(this.orders);
              // this.getItems();
            } else {
              this.orders = [];
            }
          } else {
            this.orders = [];
          }
          this.isLoading = false;
        }).catch(err => {
          //ignore
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
        this.navCtrl.push('UserLoginPage', { redirect: "redirect-orderhistory"});
      }
    }).catch(err => {
      //ignore
      this.isLoading = false;
    });
  }

  refreshList(refresher) {
    this.deliveryService.getOrders(this.user.userId, this.start, this.offset).then(orderRes => {
      if (orderRes['cartlist']) {
        let orderArray = orderRes['cartlist'];
        if (orderArray.length > 0) {
          this.orders = orderArray;
          // this.getItems();
        } else {
          this.orders = [];
        }
      } else {
        this.orders = [];
      }
      refresher.complete();
    });
  }

  // getItems() {
    // this.orders.forEach(order => {
    //   order.orderDetails.forEach(detail => {
    //     this.deliveryService.findItem(detail.itemCode).then(item => {
    //       detail.itemCode = item;
    //     });
    //   });
    // });
    // console.log(this.orders);
  // }

  paginate(infiniteScroll) {
    this.noMoreItems = false;
    this.start++;
    this.deliveryService.getOrders(this.user.userId, this.start, this.offset).then(orderRes => {
      let orderArray = orderRes['cartlist'];
      if (orderArray) {
        if (orderArray.length > 0) {
          orderArray.forEach((order) => {
            this.orders.push(order);
          });
        } else {
          this.start--;
          this.noMoreItems = true;
          infiniteScroll.enable(false);
        }
      } else {
        this.start--;
        this.noMoreItems = true;
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
  }

  getActions(order: any) {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Quantity',
      buttons: [
        {
          text: 'Send Review',
          icon: 'star',
          cssClass: 'action-feedback-btn',
          handler: () => {
            // console.log('Feedback Clicked');
            this.reviewPrompt(order);
          }
        },
        {
          text: 'Cancel',
          icon: 'close-circle',
          cssClass: 'action-cancel-btn',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  reviewPrompt(order: any) {
    let reviewModal = this.modalCtrl.create('OrderFeedback', { order: order });
    reviewModal.present();
    reviewModal.onDidDismiss((data) => {
      if (data.success) {
        let alert = this.alertCtrl.create({
          title: 'Success',
          cssClass: 'alert-style',
          message: 'Review Added.',
          buttons: [
            {
              text: 'OK',
              cssClass: 'alert-button-success',
              handler: () => {
                //ignore
              }
            }
          ]
        });
        alert.present();
      }
    });
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
