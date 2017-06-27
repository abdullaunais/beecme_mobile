import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { DeliveryService } from "../../providers/delivery-service";
import { Variables } from "../../providers/variables";
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the Shops page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shops',
  templateUrl: 'shops.html',
  providers: [DeliveryService]
})
export class Shops {
  category: any;
  city: any;
  shops: Array<any> = [];

  start: number = 0;
  offset: number = 20;

  watchCart: Subscription;
  isLoading: boolean;
  isAvailable: boolean;
  cartCount: number;
  noMoreShops: boolean;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private variables: Variables,
    private deliveryService: DeliveryService
  ) {
    this.category = navParams.data.category;
    this.city = navParams.data.city;
    this.isLoading = true;
    this.noMoreShops = false;
  }

  ionViewWillEnter() {
    this.watchCart = this.variables.cartCount.subscribe(value => this.cartCount = value);
  }

  ionViewWillLeave() {
    this.watchCart.unsubscribe();
  }

  ionViewDidEnter() {
    this.initialize();
  }

  initialize() {
    let catId = this.category['categoryId'];
    let cityId = this.city['id'];
    this.deliveryService.getShops(cityId, catId, this.start, this.offset).then((data) => {
      let json = JSON.stringify(data);
      this.shops = JSON.parse(json);
      if (this.shops) {
        if (this.shops.length > 0) {
          this.isAvailable = true;
          this.shops.forEach((shop, index) => {
            let keywordString = shop.keywords;
            let keywords = keywordString.split(" ");
            this.shops[index]['keywordsArray'] = keywords;
          });
        } else {
          this.isAvailable = false;
          this.shops = [];
        }
      } else {
        this.isAvailable = false;
        this.shops = [];
      }
      this.isLoading = false;
    });
  }

  refreshList(refresher) {
    let catId = this.category['categoryId'];
    let cityId = this.city['id'];
    this.deliveryService.getShops(cityId, catId, this.start, this.offset).then((data) => {
      let json = JSON.stringify(data);
      this.shops = JSON.parse(json);
      if (this.shops) {
        if (this.shops.length > 0) {
          this.isAvailable = true;
          this.shops.forEach((shop, index) => {
            let keywordString = shop.keywords;
            let keywords = keywordString.split(" ");
            this.shops[index]['keywordsArray'] = keywords;
          });
        } else {
          this.isAvailable = false;
          this.shops = [];
        }
      } else {
        this.isAvailable = false;
        this.shops = [];
      }
      refresher.complete();
    });
  }

  paginate(infiniteScroll) {
    let catId = this.category['categoryId'];
    let cityId = this.city['id'];
    this.noMoreShops = false;
    this.start++;
    this.deliveryService.getShops(cityId, catId, this.start, this.offset).then((data) => {
      let json = JSON.stringify(data);
      let shops = JSON.parse(json);
      if (shops) {
        if (shops.length > 0) {
          shops.forEach((item) => {
            this.shops.push(item);
          });
        } else {
          this.start--;
          this.noMoreShops = true;
          infiniteScroll.enable(false);
        }
      } else {
        this.start--;
        this.noMoreShops = true;
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
  }

  viewShop(shop) {
    this.navCtrl.push('ItemList', { shop: shop, city: this.city, category: this.category });
  }

  openCart() {
    this.navCtrl.push('CartPage', { city: this.city });
  }

  // openMenu() {
  //   this.menuCtrl.open();
  // }

  shopDetails(e: Event, shop) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let detailsModal = this.modalCtrl.create('ShopDetailsPage', {shop: shop});
    detailsModal.present();
    detailsModal.onDidDismiss((data) => {
      if (data) {
      }
    });
  }


  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad Shops');
  // }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }
}
