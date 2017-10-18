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
  selectedCity: any = null;

  categories: Array<any> = [];
  rows: Array<any> = [];
  selectedCategory: string;
  defaultImage: string = "assets/img/ui_icons/loading-loop-cover.webp";

  watchCart: Subscription;
  cartCount: number = 0;
  isLoading: boolean;
  isAvailable: boolean;
  isError: boolean;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private deliveryService: DeliveryService,
    private storage: Storage,
    private variables: Variables
  ) {
    this.isLoading = true;
    this.isAvailable = true;
    this.isError = false;

    if (!this.navParams.data.locationSet) {
      this.storage.get('location.city').then((city) => {
        if (city) {
          this.selectedCity = city;
          this.initialize();
        }
      });
    } else {
      this.selectedCity = this.navParams.data.city;
      this.initialize();
    }
  }

  ionViewWillEnter() {
    this.watchCart = this.variables.cartCount.subscribe(value => this.cartCount = value);
  }

  ionViewWillLeave() {
    this.watchCart.unsubscribe();
  }

  retryServer() {
    this.isLoading = true;
    this.isAvailable = true;
    this.isError = false;
    this.initialize();
  }

  initialize() {
    this.deliveryService.getCategories(this.selectedCity.id).then((data) => {
      let json = JSON.stringify(data);
      let catArray = JSON.parse(json);
      if (catArray) {
        let timeout = 0;
        catArray.forEach(cat => {
          setTimeout(() => {
            this.categories.push(cat);
          }, timeout += 100)
        });
        this.isAvailable = true;
        this.isError = false;
      } else {
        this.isAvailable = false;
        this.isError = false;
      }
      this.isLoading = false;
    }).catch(err => {
      this.isLoading = false;
      this.isError = true;
      console.log(err);
    });
  }

  openCart() {
    this.navCtrl.push('CartPage', { city: this.selectedCity });
  }

  openCategory(category) {
    this.navCtrl.push('Shops', { category: category, city: this.selectedCity });
  }
}
