import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DeliveryService } from '../../providers/delivery-service';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { Slides, ToastController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'first_launch',
  templateUrl: 'first_launch.html',
  providers: [DeliveryService]
})
export class FirstLaunch {
  deliveryService: DeliveryService;
  storage: Storage;

  isAgreedToTerms: boolean = false;

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
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.deliveryService = delivery;
    this.storage = storage;
    this.initialize();
    //  if (true){
    //    swiperInstance.unlockSwipes();
    //  } else {
    //    swiperInstance.lockSwipes();
    //  }
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
      this.storage.set('delivery.cartShop', {});

      this.navCtrl.setRoot('Categories', {
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

  checkIsAgreedToTerms() {
    if (this.isAgreedToTerms) {
      this.goToSlide(2);
      this.unlockSwipe();
    } else {
      let toast = this.toastCtrl.create({
        message: "You should accept the terms and conditions before continuing",
        showCloseButton: true,
        closeButtonText: 'OK',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  }

  goToSlide(num) {
    this.slides.slideTo(num, 500);
  }

  lockSwipe() {
    this.slides.lockSwipes(true);
  }

  unlockSwipe() {
    this.slides.lockSwipes(false);
  }

  lockSwipeNext() {
    this.slides.lockSwipeToNext(true);
  }

  unlockSwipeNext() {
    this.slides.lockSwipeToNext(false);
  }

}
