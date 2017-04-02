import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DetailsPage } from "../details/details";
import { DeliverySchedulePage } from "../delivery-schedule/delivery-schedule";
import { UserLoginPage } from "../user-login/user-login";

/*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {

  cartItems: Array<any>;
  storage : Storage;

  cartIsEmpty : boolean = false;
  isLoading: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, storage : Storage) {
    this.cartItems = [];
    this.storage = storage;
    this.isLoading = true;

    storage.get('delivery.cart').then((cart) => {
      console.info("CartItems --> ", cart);
      if(cart) {
        if(cart.length > 0) {
          this.cartItems = cart;
          this.cartIsEmpty = false;
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
    this.storage.set('delivery.cart', this.cartItems);
  }

  viewItem(item) {
    this.navCtrl.push(DetailsPage, item);
  }

  checkout() {
    this.storage.get('user.login').then((auth) => {
      if(auth) {
        this.navCtrl.push(DeliverySchedulePage, this.cartItems);
      } else {
        // DeliverySchedulePage - testing
        // UserLoginPage - original
        this.navCtrl.push(UserLoginPage, "redirect-deliveryschedule"); 
      }
    });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad CartPage');
  // }

}
