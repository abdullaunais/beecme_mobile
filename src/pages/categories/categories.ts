import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DeliveryService } from '../../providers/delivery-service';
import { Variables } from "../../providers/variables";


@IonicPage()
@Component({
  selector: 'categories',
  templateUrl: 'categories.html',
  providers: [DeliveryService]
})
export class Categories {
  filterText: string = '';
  selectedCity: any = null;
  storage: Storage;

  categories: Array<any> = [];
  rows: Array<any> = [];
  deliveryService: DeliveryService;
  selectedCategory: string;

  cartCount: number = 0;
  isLoading: boolean;
  isAvailable: boolean;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    delivery: DeliveryService,
    storage: Storage,
    private variables: Variables
    ) {
    this.deliveryService = delivery;
    this.storage = storage;
    this.isLoading = true;
    this.isAvailable = true;
    
    this.variables.cartCount.subscribe(value => this.cartCount = value); 
    
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
    });
  }

  openCart() {
    this.navCtrl.push('CartPage', null);
  }

  openCategory(category) {
    this.navCtrl.push('Shops', { category:  category, city: this.selectedCity});
  }

}
