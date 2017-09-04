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

  cartCount: number;
  isLoading: boolean;
  isAvailable: boolean;
  noMoreItems: boolean;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private deliveryService: DeliveryService,
    private storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private variables: Variables,
    private toastCtrl: ToastController
  ) {
    this.isLoading = true;
    this.isAvailable = true;
    this.noMoreItems = false;
    this.shop = this.navParams.data.shop;
    this.city = this.navParams.data.city;
    this.category = this.navParams.data.category;
    this.variables.cartCount.subscribe(value => this.cartCount = value);

    this.initialize();
  }

  initialize() {
    let shopId = this.shop['shopId'];
    this.deliveryService.getItemByShop(shopId, this.start, this.offset).then((data) => {
      if (data['itemlist']) {
        if (data['itemlist'].length > 0) {
          this.isAvailable = true;
          let timeout = 0;
          data['itemlist'].forEach(item => {
            setTimeout(() => {
              this.items.push(item);
            }, timeout += 100);
          });
        } else {
          this.items = [];
          this.isAvailable = false;
        }
      } else {
        this.items = [];
        this.isAvailable = false;
      }
      this.isLoading = false;
    }).catch(err => {
      this.isLoading = false;
      this.isAvailable = false;
    });
  }

  refreshList(refresher) {
    let shopId = this.shop['shopId'];
    this.deliveryService.getItemByShop(shopId, 0, this.offset).then((data) => {
      if (data['itemlist']) {
        if (data['itemlist'].length > 0) {
          this.items = [];
          this.isAvailable = true;
          let timeout = 0;
          data['itemlist'].forEach(item => {
            setTimeout(() => {
              this.items.push(item);
            }, timeout += 100);
          });

        } else {
          this.items = [];
          this.isAvailable = false;
        }
      } else {
        this.items = [];
        this.isAvailable = false;
      }
      refresher.complete();
    }).catch(err => {
      this.isLoading = false;
      this.isAvailable = false;
    });;
  }

  paginate(infiniteScroll) {
    let shopId = this.shop['shopId'];
    this.noMoreItems = false;
    this.start++;
    this.deliveryService.getItemByShop(shopId, this.start, this.offset).then((data) => {
      let itemArray = data['itemlist'];
      if (itemArray) {
        if (itemArray.length > 0) {
          itemArray.forEach((item) => {
            this.items.push(item);
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

  validateCart(e: Event, item) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

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
                          this.selectQuantity(item);
                        });
                      });
                    });
                  }
                }
              ]
            });
            cartAlert.present();
          } else {
            this.selectQuantity(item);
          }
        } else {
          this.selectQuantity(item);
        }
      }
    });
  }

  selectQuantity(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Quantity',
      buttons: [
        {
          text: '1 ' + item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(1, item);
          }
        },
        {
          text: '2 ' + item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(2, item);
          }
        },
        {
          text: '3 ' + item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(3, item);
          }
        },
        {
          text: '4 ' + item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(4, item);
          }
        },
        {
          text: '5 ' + item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(5, item);
          }
        },
        {
          text: 'More than 5',
          cssClass: 'action-blue-btn',
          handler: () => {
            setTimeout(() => {
              this.quantityPrompt(item);
            }, 300);
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

  addToCart(quantity, item) {
    // if (this.item.qty >= quantity) {
    item.quantity = quantity;
    this.storage.get('delivery.cart').then((cart) => {
      let cartItems: Array<any> = cart;
      let prevCart = cartItems.filter(x => x.itemCode == item.itemCode);
      if (prevCart && prevCart.length > 0) {
        let index = cartItems.findIndex(x => x.itemCode == item.itemCode);
        cartItems[index] = item
        this.storage.set("delivery.cart", cartItems).then(res => {
          this.storage.set("delivery.cartCount", cartItems.length).then(res => {
            this.storage.set("delivery.cartShop", this.shop).then(res => {
              this.variables.setCartCount(cartItems.length);
            });
          });
        });
      } else {
        cartItems.push(item);
        this.storage.set('delivery.cart', cartItems).then((response) => {
          this.storage.set('delivery.cartCount', cartItems.length).then((res) => {
            this.storage.set("delivery.cartShop", this.shop).then(res => {
              this.variables.setCartCount(cartItems.length);
              // this.navCtrl.push(CartPage, null);
            });
          });
        });
      }
    });
  }

  quantityPrompt(item) {
    let prompt = this.alertCtrl.create({
      title: 'Enter Quantity',
      message: "Quantity should be a valid number",
      cssClass: 'alert-style',
      inputs: [{
        name: 'quantity',
        placeholder: 'Quantity',
        type: 'number'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-danger-plain',
          handler: data => {
          }
        },
        {
          text: 'Add',
          cssClass: 'alert-button-primary',
          handler: data => {
            console.log('Add Clicked!');
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
    this.navCtrl.push('DetailsPage', { item: item, shop: this.shop, category: this.category, city: this.city }, { animate: true, direction: "forward" });
  }

  openCart() {
    this.navCtrl.push('CartPage', { city: this.city }, { animate: true, direction: "forward" });
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
