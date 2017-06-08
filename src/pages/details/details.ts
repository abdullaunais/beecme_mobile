import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController, AlertController, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";

/*
  Generated class for the Details page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

  @ViewChild(Content) content: Content;
  headerShow: boolean = false;

  item: any;
  shop: any;
  category: any;
  storage: Storage;

  cartCount: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private variables: Variables,
    private toastCtrl: ToastController
  ) {
    this.item = navParams.data.item;
    this.shop = navParams.data.shop;
    this.category = navParams.data.category;
    this.storage = storage;
    this.variables.cartCount.subscribe(value => this.cartCount = value);
  }

  selectQuantity() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Quantity',
      buttons: [
        {
          text: '1',
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(1);
          }
        },
        {
          text: '2',
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(2);
          }
        },
        {
          text: '3',
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(3);
          }
        },
        {
          text: '4',
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(4);
          }
        },
        {
          text: '5',
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(5);
          }
        },
        {
          text: 'More than 5',
          cssClass: 'action-blue-btn',
          handler: () => {
            this.quantityPrompt();
          }
        },
        {
          text: 'Cancel',
          cssClass: 'action-cancel-btn',
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
      cssClass: 'alert-style',
      inputs: [
        { name: 'quantity', placeholder: 'Quantity' },
      ],
      buttons: [
        { 
          text: 'Cancel',
          cssClass: 'alert-button-danger-plain',
          handler: data => { } },
        {
          text: 'Add',
          cssClass: 'alert-button-primary',
          handler: data => {
            if (data.quantity) {
              if (!Number.isNaN(data.quantity) && data.quantity > 0) {
                this.addToCart(data.quantity);
              } else {
                // Quantity should be a number
                this.presentToast("Quantity should be a valid number", 3000);
              }
            } else {
              this.presentToast("Quantity is required", 3000);
            }
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
          handler: data => { } },
        {
          text: 'Add',
          cssClass: 'alert-button-primary',
          handler: data => {
            // if (this.item.qty >= quantity) {
            this.item.comment = data.comment;
            this.item.quantity = quantity;
            this.storage.get('delivery.cart').then((cart) => {
              let cartItems: Array<any> = cart;
              let prevCart = cartItems.filter(x => x.itemCode == this.item.itemCode);
              if (prevCart && prevCart.length > 0) {
                let index = cartItems.findIndex(x => x.itemCode == this.item.itemCode);
                cartItems[index] = this.item
                this.storage.set("delivery.cart", cartItems).then(res => {
                  this.storage.set("delivery.cartCount", cartItems.length).then(res => {
                    this.storage.set("delivery.cartShop", this.shop).then(res => {
                      this.variables.setCartCount(cartItems.length);
                    });
                  });
                });
              } else {
                cartItems.push(this.item);
                this.storage.set('delivery.cart', cartItems).then((response) => {
                  this.storage.set('delivery.cartCount', cartItems.length).then((res) => {
                    this.storage.set("delivery.cartShop", this.shop).then(res => {
                      this.variables.setCartCount(cartItems.length);
                    });
                  });
                });
              }

            });
            // } else {
            //   let alert = this.alertCtrl.create({
            //     title: 'Cant add more than the available amount!',
            //     subTitle: 'Please select a quantity that is available',
            //     buttons: ['OK']
            //   });
            //   alert.present();
            // }
          }
        }
      ]
    });
    prompt.present();
  }

    validateCart() {
    this.storage.get('delivery.cartShop').then((cartShop) => {
      if (cartShop) {
        if (cartShop.userId) {
          if (parseInt(cartShop.userId) !== parseInt(this.shop.userId)) {
            let cartAlert = this.alertCtrl.create({
              title: 'Existing Cart',
              cssClass: 'alert-style',
              message: 'Your cart already contains items from a different Shop. You can only  add items from one shop at a time. Do you wish to clear the existing cart and add this item?',
              buttons: [
                {
                  text: 'Cancel',
                  cssClass: 'alert-button-danger-plain',
                  role: 'cancel',
                  handler: () => {
                    return;
                  }
                },
                {
                  text: 'Clear Cart',
                  cssClass: 'alert-button-primary',
                  handler: () => {
                    this.storage.set("delivery.cart", []).then(res => {
                      this.storage.set("delivery.cartCount", 0).then(res => {
                        this.storage.set("delivery.cartShop", {}).then(res => {
                          this.variables.setCartCount(0);
                          this.selectQuantity();
                        });
                      });
                    });
                  }
                }
              ]
            });
            cartAlert.present();
          } else {
            this.selectQuantity();
          }
        } else {
          this.selectQuantity();
        }
      }
    });
  }

  showImages() {
    this.navCtrl.push('ImageSliderPage', this.item);
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

  goToCart() {
    this.navCtrl.push('CartPage');
  }

  ngAfterViewInit() {
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }
}
