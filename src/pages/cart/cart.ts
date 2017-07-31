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
  loading: any;
  city: any;

  cartItems: Array<any> = [];
  cartShop: any = {};

  cartIsEmpty: boolean = false;
  isLoading: boolean;
  shopIsVisible: boolean;
  totalAmount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private variables: Variables,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.isLoading = true;
    this.shopIsVisible = false;
    this.initialize();
  }

  initialize() {
    this.storage.get('delivery.cart').then((cart) => {
      if (cart) {
        if (cart.length > 0) {
          this.storage.get('delivery.cartShop').then((cartShop) => {
            this.cartShop = cartShop;
            this.shopIsVisible = true;
            this.cartIsEmpty = false;
            this.cartItems = [];
            let timeout = 0;
            cart.forEach((item) => {
              this.totalAmount = this.totalAmount + (item.price * item.quantity);
              setTimeout(() => {
                this.cartItems.push(item);
              }, timeout += 100);
            });
          }).catch(shopErr => {
            this.shopIsVisible = false;
          });
        } else {
          this.cartItems = [];
          this.cartIsEmpty = true;
        }
      } else {
        this.cartItems = [];
        this.cartIsEmpty = true;
      }
      this.isLoading = false;
    }).catch(err => {
      this.isLoading = false;
    });
    this.storage.get('location.city').then((city) => {
      this.city = city;
    });
  }

  removeItem(item, index) {
    document.getElementById('item' + index).classList.remove('flipInX');
    document.getElementById('item' + index).classList.add('fadeOutRightBig');
    setTimeout(() => {
      this.cartItems.splice(this.cartItems.findIndex((elem) => elem.itemCode === item.itemCode), 1);
      this.totalAmount = 0;
      this.cartItems.forEach((item) => {
        this.totalAmount = this.totalAmount + (item.price * item.quantity);
      })
      this.storage.set('delivery.cart', this.cartItems);
      this.storage.set('delivery.cartCount', this.cartItems.length);
      if (this.cartItems.length === 0) {
        this.storage.set('delivery.cartShop', {});
        this.shopIsVisible = false;
        this.cartIsEmpty = true;
      }
      this.variables.setCartCount(this.cartItems.length);
    }, 350);
  }

  viewItem(item) {
    this.navCtrl.push('DetailsPage', { item: item, shop: this.cartShop, city: this.city, category: {} });
  }

  checkAmount() {
    this.storage.get('delivery.cartShop').then((cartShop) => {
      if (cartShop) {
        if (cartShop.userId) {
          if (this.totalAmount < cartShop.minOrderAmt) {
            this.presentToast("You should have at least " + cartShop.minOrderAmt + " worth items in this shop to checkout. Add some more items", 2000);
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
    this.storage.get('user.login').then((auth) => {
      if (auth) {
        this.navCtrl.push('CheckoutOptionsPage');
      } else {
        this.navCtrl.push('UserLoginPage', { redirect: "redirect-deliveryschedule" });
      }
    });
  }

  addComment(index) {
    let prompt = this.alertCtrl.create({
      title: 'Enter Comment',
      message: "",
      cssClass: 'alert-style',
      inputs: [
        { name: 'comment', placeholder: 'Comment' },
      ],
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-danger-plain',
          handler: data => { }
        },
        {
          text: 'ADD',
          cssClass: 'alert-button-primary',
          handler: data => {
            this.cartItems[index].commentDtl = data.comment;
            this.storage.set("delivery.cart", this.cartItems).then(res => {
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
