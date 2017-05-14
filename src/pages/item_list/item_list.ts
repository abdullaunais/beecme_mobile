import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController, AlertController, ToastController, IonicPage } from 'ionic-angular';
import { DeliveryService } from "../../providers/delivery-service";
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";

@IonicPage()
@Component({
  selector: 'item_list',
  templateUrl: 'item_list.html',
  providers: [DeliveryService]
})
export class ItemList {

  @ViewChild(Content) content: Content;
  searchVisible: boolean = false;

  shop: any;
  city: any;
  category: any;
  items: Array<any> = [];
  searchQuery: string = '';
  filters: Array<string>;

  start: number = 0;
  offset: number = 20;

  deliveryService: DeliveryService;
  storage: Storage;

  cartCount: number;
  isLoading: boolean;
  noMoreItems: boolean;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    delivery: DeliveryService,
    storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private variables: Variables,
    private toastCtrl: ToastController
  ) {
    this.deliveryService = delivery;
    this.storage = storage;
    this.isLoading = true;
    this.noMoreItems = false;
    this.shop = navParams.data.shop;
    this.city = navParams.data.city;
    this.category = navParams.data.category;
    this.variables.cartCount.subscribe(value => this.cartCount = value);

    this.initialize();
  }

  initialize() {
    let userId = this.shop['userId'];
    this.deliveryService.getItemByShop(userId, this.start, this.offset).then((data) => {
      if (data['itemlist']) {
        if (data['itemlist'].length > 0) {
          this.items = data['itemlist'];
        } else {
          this.items = [];
        }
      } else {
        this.items = [];
      }
      this.isLoading = false;
    });
  }

  refreshList(refresher) {
    let userId = this.shop['userId'];
    this.deliveryService.getItemByShop(userId, 0, this.offset).then((data) => {
      if (data['itemlist']) {
        if (data['itemlist'].length > 0) {
          this.items = data['itemlist'];
        } else {
          this.items = [];
        }
      } else {
        this.items = [];
      }
      refresher.complete();
    });
  }

  paginate(infiniteScroll) {
    let userId = this.shop['userId'];
    this.noMoreItems = false;
    this.start++;
    this.deliveryService.getItemByShop(userId, this.start, this.offset).then((data) => {
      let itemArray = data['itemlist'];
      if (itemArray) {
        if (itemArray.length > 0) {
          itemArray.forEach((item) => {
            this.items.push(item);
          });
        } else {
          this.start--;
          this.noMoreItems = true;
        }
      } else {
        this.start--;
        this.noMoreItems = true;
      }
      infiniteScroll.complete();
    });
  }

  showSearch() {
    this.searchVisible = true;
    this.content.resize();
  }

  hideSearch() {
    this.searchVisible = false;
    this.content.resize();
  }

  onSearchTextEntered() {

  }

  onSearchCancel() {
    this.hideSearch();
  }

  selectQuantity(e: Event, item) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Quantity',
      buttons: [
        {
          text: '1',
          role: '1',
          handler: () => {
            this.addToCart(1, item);
          }
        },
        {
          text: '2',
          handler: () => {
            this.addToCart(2, item);
          }
        },
        {
          text: '3',
          handler: () => {
            this.addToCart(3, item);
          }
        },
        {
          text: '4',
          handler: () => {
            this.addToCart(4, item);
          }
        },
        {
          text: '5',
          handler: () => {
            this.addToCart(5, item);
          }
        },
        {
          text: 'More than 5',
          handler: () => {
            this.quantityPrompt(item);
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

  addToCart(quantity, item) {
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
          text: 'ADD',
          cssClass: 'alert-button-primary',
          handler: data => {
            // if (this.item.qty >= quantity) {
            item.comment = data.comment;
            item.quantity = quantity;
            this.storage.get('delivery.cart').then((cart) => {
              let cartItems: Array<any> = cart;
              let prevCart = cartItems.filter(x => x.itemCode == item.itemCode);
              if (prevCart && prevCart.length > 0) {
                let index = cartItems.findIndex(x => x.itemCode == item.itemCode);
                cartItems[index] = item
                this.storage.set("delivery.cart", cartItems).then(res => {
                  this.storage.set("delivery.cartCount", cartItems.length).then(res => {
                    this.variables.setCartCount(cartItems.length);
                  });
                });
              } else {
                cartItems.push(item);
                this.storage.set('delivery.cart', cartItems).then((response) => {
                  this.storage.set('delivery.cartCount', cartItems.length).then((res) => {
                    this.variables.setCartCount(cartItems.length);
                    // this.navCtrl.push(CartPage, null);
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

  quantityPrompt(item) {
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
                this.addToCart(data.quantity, item);
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

  errorUpdateUrl(event, index) {
    this.items[index].img1 = "assets/img/items/" + this.category.nameEn.toLowerCase() + "_default.svg";
    console.log(this.items[index].img1);
  }

  viewDetails(item) {
    this.navCtrl.push('DetailsPage', {item : item, shop: this.shop}, { animate: true, direction: "forward" });
  }

  openCart() {
    this.navCtrl.push('CartPage', null);
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
