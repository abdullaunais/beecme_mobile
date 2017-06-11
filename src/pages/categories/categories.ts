import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DeliveryService } from '../../providers/delivery-service';
import { Variables } from "../../providers/variables";
import { Subscription } from "rxjs/Subscription";


@IonicPage()
@Component({
  selector: 'categories',
  templateUrl: 'categories.html',
  providers: [DeliveryService]
})
export class Categories {
  filterText: string = '';
  selectedCity: any = null;

  categories: Array<any> = [];
  rows: Array<any> = [];
  selectedCategory: string;

  watchCart: Subscription;
  cartCount: number = 0;
  isLoading: boolean;
  isAvailable: boolean;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private deliveryService: DeliveryService,
    storage: Storage,
    private variables: Variables
    ) {
    this.isLoading = true;
    this.isAvailable = true;

    if (!navParams.data.locationSet) {
      storage.get('location.city').then((city) => {
        if (city) {
          this.selectedCity = city;
          this.initialize();
        }
      });
    } else {
      this.selectedCity = navParams.data.city;
      this.initialize();
    }
  }

  ionViewWillEnter() {
    this.watchCart = this.variables.cartCount.subscribe(value => this.cartCount = value); 
  }

  ionViewWillLeave() {
    this.watchCart.unsubscribe();
  }

  initialize() {
    this.deliveryService.getCategories(this.selectedCity.id).then((data) => {
      let json = JSON.stringify(data);
      this.categories = JSON.parse(json);
      if (this.categories) {
        if (this.categories.length > 1) {
          this.categories.splice(0, 1);
          this.rows = Array.from(Array(Math.ceil(this.categories.length / 2)).keys());
          this.isAvailable = true;
        } else {
          this.isAvailable = false;
        }
      } else {
        this.isAvailable = false;
      }
      this.isLoading = false;
    }).catch(err => {
      // this.isAvailable = false;
      // this.isLoading = false;
    });
  }

  openCart() {
    this.navCtrl.push('CartPage', null);
  }

  openCategory(category) {
    this.navCtrl.push('Shops', { category:  category, city: this.selectedCity});
  }

}
