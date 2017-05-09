import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeliveryService } from "../../providers/delivery-service";
import { Variables } from "../../providers/variables";

/**
 * Generated class for the Shops page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-shops',
  templateUrl: 'shops.html',
  providers: [DeliveryService]
})
export class Shops {

  deliveryService: DeliveryService;
  category: any;
  city: any;
  shops: Array<any> = [];

  start: number = 0;
  offset: number = 20;

  isLoading: boolean;
  isAvailable: boolean;
  cartCount: number;
  noMoreShops: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private variables: Variables,
    delivery: DeliveryService
  ) {
    this.variables.cartCount.subscribe(value => this.cartCount = value);
    this.deliveryService = delivery;
    this.category = navParams.data.category;
    this.city = navParams.data.city;
    this.isLoading = true;
    this.noMoreShops = false;
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
          this.noMoreShops= true;
        }
      } else {
        this.start--;
        this.noMoreShops = true;
      }
      infiniteScroll.complete();
    });
  }

  viewItems(shop) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Shops');
  }

}
