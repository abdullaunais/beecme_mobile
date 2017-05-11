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
    this.variables.setCartCount(this.cartItems.length);
  }

  viewItem(item) {
    this.navCtrl.push('DetailsPage', item);
  }

  checkout() {
    if (this.totalAmount < 100) {
      this.presentToast("You should have at least 100 SAR worth items. Add some more items to checkout", 2000);
      return;
    }

    let prompt = this.alertCtrl.create({
      title: 'Checkout Comment',
      message: "",
      cssClass: 'prompt-ui-theme',
      inputs: [
        { name: 'comment', placeholder: 'Comment' },
      ],
      buttons: [
        { text: 'Cancel', handler: data => { } },
        {
          text: 'Save',
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
}
