import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
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
    public toastCtrl: ToastController,
    private navParams: NavParams,
    private deliveryService: DeliveryService,
    private storage: Storage,
    private variables: Variables
  ) {
    this.isLoading = true;
    this.isAvailable = true;
    this.isError = false;
  }

  ionViewWillEnter() {
    this.watchCart = this.variables.cartCount.subscribe(value => this.cartCount = value);
  }

  ionViewWillLeave() {
    this.watchCart.unsubscribe();
  }

  ionViewDidEnter() {
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

  retryServer() {
    this.isLoading = true;
    this.isAvailable = true;
    this.isError = false;
    this.initialize();
  }

  initialize() {
    this.deliveryService.getCategories(this.selectedCity.id).then((data) => {
      let json = JSON.stringify(data);
      this.categories = JSON.parse(json);
      if (this.categories) {
        if (this.categories.length > 1) {
          this.categories.splice(0, 1);
          // this.rows = Array.from(Array(Math.ceil(this.categories.length / 2)).keys());
          this.isAvailable = true;
          this.isError = false;
        } else {
          this.isAvailable = false;
          this.isError = false;
        }
      } else {
        this.isAvailable = false;
        this.isError = false;
      }
      this.isLoading = false;
    }).catch(err => {
      this.isLoading = false;
      this.isError = true;
    });
  }

  openCart() {
    this.navCtrl.push('CartPage', {city: this.selectedCity});
  }

  openCategory(category) {
    this.navCtrl.push('Shops', { category: category, city: this.selectedCity });
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
