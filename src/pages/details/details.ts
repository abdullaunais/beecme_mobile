import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController, AlertController } from 'ionic-angular';
import {CartPage} from "../cart/cart";
import { Storage } from '@ionic/storage';

/*
  Generated class for the Details page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

  @ViewChild(Content) content: Content;
  cartPage = CartPage;
  headerShow: boolean = false;

  item : any;
  storage: Storage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              storage: Storage,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController ) {
    this.item = navParams.data;
    this.storage = storage;
  }

  selectQuantity() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Quantity',
      buttons: [
        {
          text: '1',
          role: '1',
          handler: () => {
            this.addToCart(1);
          }
        },
        {
          text: '2',
          handler: () => {
            this.addToCart(2);
          }
        },
        {
          text: '3',
          handler: () => {
            this.addToCart(3);
          }
        },
        {
          text: '4',
          handler: () => {
            this.addToCart(4);
          }
        },
        {
          text: '5',
          handler: () => {
            this.addToCart(5);
          }
        },
        {
          text: 'More than 5',
          handler: () => {
            this.quantityPrompt();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  quantityPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Enter Quantity',
      message: "",
      inputs: [
        { name: 'quantity', placeholder: 'Quantity' },
      ],
      buttons: [
        { text: 'Cancel', handler: data => {}},
        { text: 'Add',
          handler: data => {
            this.addToCart(data.quantity);
          }
        }
      ]
    });
    prompt.present();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad DetailsPage');
  // }

  addToCart(quantity) {
    if(this.item.qty >= quantity) {
      this.item.cartQuantity = quantity;
      this.storage.get('delivery.cart').then((cart) => {
        let cartItems : Array<any> = cart;
        cartItems.push(this.item);
        this.storage.set('delivery.cart', cartItems);
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Cant add more than the available amount!',
        subTitle: 'Please select a quantity that is available',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  ngAfterViewInit() {
    // let itemContent = document.getElementById('itemContent');
    // let yOffset = itemContent.offsetTop;
    // console.log(yOffset);

    // this.content.ionScroll.subscribe(($event: any) => {
    //   this.headerShow = $event.scrollTop > 300;
    // });
  }

}
