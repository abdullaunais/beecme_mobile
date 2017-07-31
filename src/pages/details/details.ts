import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ToastController, IonicPage, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Variables } from "../../providers/variables";
import { DeliveryService } from "../../providers/delivery-service";

/*
  Generated class for the Details page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
  providers: [DeliveryService]
})
export class DetailsPage {
  item: any;
  shop: any;
  category: any;
  city: any;

  cartCount: number = 0;
  offsetHeight: number;

  isLoading: boolean;
  catLoading: boolean;
  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private variables: Variables,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private deliveryService: DeliveryService
  ) {
    this.item = navParams.data.item;
    this.shop = navParams.data.shop;
    this.category = navParams.data.category;
    this.city = navParams.data.city;
    this.variables.cartCount.subscribe(value => this.cartCount = value);
    this.initialize();
  }

  initialize() {
    if (!this.category.nameEn) {
      this.catLoading = true;
      // this.showLoading("Please wait...");
      this.storage.get("location.city").then(city => {
        this.deliveryService.getCategories(city.id).then(categoryList => {
          let json = JSON.stringify(categoryList);
          let catArray = JSON.parse(json);
          catArray.forEach(element => {
            if (element.categoryId === this.item.category) {
              this.category = element;
            }
          });
          this.catLoading = false;
        }).catch(err => {
          this.catLoading = false;
          this.presentToast("Error when fetching category", 2000);
        });
      });
    }
  }

  selectQuantity() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Quantity',
      buttons: [
        {
          text: '1 ' + this.item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(1);
          }
        },
        {
          text: '2 ' + this.item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(2);
          }
        },
        {
          text: '3 ' + this.item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(3);
          }
        },
        {
          text: '4 ' + this.item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(4);
          }
        },
        {
          text: '5 ' + this.item.unit,
          cssClass: 'action-blue-btn',
          handler: () => {
            this.addToCart(5);
          }
        },
        {
          text: 'More than 5',
          cssClass: 'action-blue-btn',
          handler: () => {
            setTimeout(() => {
              this.quantityPrompt();
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

  quantityPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Enter Quantity',
      message: "",
      cssClass: 'alert-style',
      inputs: [{
        name: 'quantity',
        placeholder: 'Quantity',
        type: 'number'
      }],
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-danger-plain',
          handler: data => { }
        },
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

  goToShop() {
    if (!this.catLoading) {
      this.navCtrl.push('ItemList', { shop: this.shop, city: this.city, category: this.category });
    }
  }

  shopDetails(shop) {
    let detailsModal = this.modalCtrl.create('ShopDetailsPage', { shop: shop });
    detailsModal.present();
    detailsModal.onDidDismiss((data) => {
      if (data) {
      }
    });
  }

  goToCategory() {
    if (!this.catLoading) {
      this.navCtrl.push('Shops', { city: this.city, category: this.category });
    }
  }

  ngAfterViewInit() {
    this.offsetHeight = document.getElementById('nav-content').offsetHeight;
    this.refreshPicture();
  }

  refreshPicture() {
    if (this.item.img1) {
      document.getElementById('headerImage').style.backgroundImage = "url(" + this.item.img1 + ")";
    } else {
      document.getElementById('headerImage').style.backgroundImage = "url('assets/img/cover/profile_default_grey.webp')";
    }
  }

  checkScroll(event) {
    let yOffset = document.getElementById('item-content').offsetTop;
    if (event.scrollTop > yOffset - this.offsetHeight) {
      document.getElementById('header-content').classList.remove("details-header");
    } else {
      document.getElementById('header-content').classList.add("details-header");
    }
  }

  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      content: content,
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
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
    this.navCtrl.push('CartPage', { city: this.city });
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }
}
