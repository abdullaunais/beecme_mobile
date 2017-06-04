import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";

/*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {

  cartItems: Array<any>;
  cartShop: any;
  storage: Storage;

  cartIsEmpty: boolean = false;
  isLoading: boolean;
  totalAmount: number = 0;

  checkoutComment: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    storage: Storage,
    private variables: Variables,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.cartItems = [];
    this.storage = storage;
    this.isLoading = true;

    storage.get('delivery.cart').then((cart) => {
      console.info("CartItems --> ", cart);
      if (cart) {
        if (cart.length > 0) {
          this.cartItems = cart;
          this.cartIsEmpty = false;
          this.cartItems.forEach((item) => {
            this.totalAmount = this.totalAmount + (item.price * item.quantity);
          })
        } else {
          this.cartItems = [];
          this.cartIsEmpty = true;
        }
      } else {
        this.cartItems = [];
        this.cartIsEmpty = true;
      }
      this.isLoading = false;
      this.storage.get('delivery.cartShop').then((cartShop) => {
        this.cartShop = cartShop;
      });
    });
  }

  removeItem(item) {
    this.cartItems.splice(
      this.cartItems.findIndex(
        (elem) => elem.itemCode === item.itemCode
      ), 1
    );
    this.totalAmount = 0;
    this.cartItems.forEach((item) => {
      this.totalAmount = this.totalAmount + (item.price * item.quantity);
    })
    this.storage.set('delivery.cart', this.cartItems);
    this.storage.set('delivery.cartCount', this.cartItems.length);
    if (this.cartItems.length === 0) {
      this.storage.set('delivery.cartShop', {});
    }
    this.variables.setCartCount(this.cartItems.length);
  }

  viewItem(item) {
    this.navCtrl.push('DetailsPage', {item: item, shop: this.cartShop});
  }

  checkAmount() {
    this.storage.get('delivery.cartShop').then((cartShop) => {
      if (cartShop) {
        if (cartShop.userId) {
          if (this.totalAmount < cartShop.minOrderAmt) {
            this.presentToast("You should have at least "+ cartShop.minOrderAmt +" worth items in this shop to checkout. Add some more items", 2000);
            return;
          } else {
            this.checkout();
          }
        } else {
          this.presentToast("Error in Checkout. Please remove all and add items again", 2000);
        }
      }
    });
  }

  checkout() {
    let prompt = this.alertCtrl.create({
      title: 'Checkout Comment',
      message: "",
      cssClass: 'alert-style',
      inputs: [
        { name: 'comment', placeholder: 'Comment' },
      ],
      buttons: [
        { 
          text: 'Cancel',
          cssClass: 'alert-button-danger-plain',
          handler: data => { } },
        {
          text: 'Checkout',
          cssClass: 'alert-button-primary',
          handler: data => {
            this.checkoutComment = data.comment;
            Variables.checkoutComment = this.checkoutComment;

            this.storage.get('user.login').then((auth) => {
              if (auth) {
                this.navCtrl.push('DeliverySchedulePage', this.checkoutComment);
              } else {
                // DeliverySchedulePage - testing
                // UserLoginPage - original
                this.navCtrl.push('UserLoginPage', "redirect-deliveryschedule");
              }
            });
          }
        }
      ]
    });
    prompt.present();
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
