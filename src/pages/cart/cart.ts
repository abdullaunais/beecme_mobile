import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, storage : Storage) {
    this.cartItems = [];
    this.storage = storage;

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
    });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad CartPage');
  // }

}
