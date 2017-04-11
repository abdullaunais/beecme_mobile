import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Categories } from "../categories/categories";
import { DeliveryService } from '../../providers/delivery-service';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'first_launch',
  templateUrl: 'first_launch.html',
  providers: [DeliveryService]
})
export class FirstLaunch {
  deliveryService: DeliveryService;
  storage: Storage;

  countries: Array<any> = [];
  provinces: Array<any> = [];
  cities: Array<any> = [];

  selectedCountry: any;
  selectedProvince: any;
  selectedCity: any;

  countrySet: boolean = false;
  provinceSet: boolean = false;
  citySet: boolean = false;

  type: number = 21;
  value: number = 1;
  start: number = 0;
  offset: number = 20;

  loading: any;
  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    delivery: DeliveryService,
    storage: Storage,
    public loadingCtrl: LoadingController
  ) {
    this.deliveryService = delivery;
    this.storage = storage;
    this.initialize();
  }

  initialize() {
    this.showLoading("Loading...");
    this.deliveryService.getLocation(this.type, this.value, this.start, this.offset).then((data) => {
      let json = JSON.stringify(data);
      this.countries = JSON.parse(json);
      this.hideLoading();
    });
  }

  countryChanged() {
    this.showLoading("Please wait...");
    this.type = 22;
    this.value = this.selectedCountry.id;
    this.deliveryService.getLocation(this.type, this.value, this.start, this.offset).then((data) => {
      let json = JSON.stringify(data);
      this.provinces = JSON.parse(json);
      this.hideLoading();
    });
    this.countrySet = true;
  }

  provinceChanged() {
    this.showLoading("Please wait...");
    this.type = 24;
    this.value = this.selectedProvince.id;
    this.deliveryService.getLocation(this.type, this.value, this.start, this.offset).then((data) => {
      let json = JSON.stringify(data);
      this.cities = JSON.parse(json);
      this.hideLoading();
    });
    this.provinceSet = true;
  }

  cityChanged() {
    this.citySet = true;

    if (this.countrySet && this.provinceSet) {
      this.storage.set('location.country', this.selectedCountry);
      this.storage.set('location.province', this.selectedProvince);
      this.storage.set('location.city', this.selectedCity);
      this.storage.set('location.set', true);
      this.storage.set('user.data', {});
      this.storage.set('user.login', false);
      this.storage.set('user.auth', null);

      this.storage.set('delivery.cart', []);
      this.storage.set('delivery.cartCount', 0);

      this.navCtrl.setRoot(Categories, {
        locationSet: true,
        city: this.selectedCity
      });

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

  goToSlide(num) {
    this.slides.slideTo(num, 500);
  }
}
