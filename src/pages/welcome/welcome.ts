import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DeliveryService } from '../../providers/delivery-service';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { Slides, ToastController, IonicPage, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html',
  providers: [DeliveryService]
})
export class Welcome {
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
    private delivery: DeliveryService,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {}

  ngAfterViewInit() {
    this.lockSwipe();
    this.initialize();
  }

  initialize() {
    this.showLoading("Loading...");
    this.delivery.getLocation(this.type, this.value, this.start, this.offset)
      .then((data) => {
        let json = JSON.stringify(data);
        this.countries = JSON.parse(json);
        this.hideLoading();
      }).catch((err) => {
        console.log("Error ", err);
        this.hideLoading();
      });
  }

  countryChanged() {
    this.showLoading("Please wait...");
    this.type = 22;
    this.value = this.selectedCountry.id;
    this.delivery.getLocation(this.type, this.value, this.start, this.offset)
      .then((data) => {
        let json = JSON.stringify(data);
        this.provinces = JSON.parse(json);
        this.hideLoading();
      }).catch((err) => {
        console.log("Error ", err);
        this.hideLoading();
      });
    this.countrySet = true;
  }

  provinceChanged() {
    this.showLoading("Please wait...");
    this.type = 24;
    this.value = this.selectedProvince.id;
    this.delivery.getLocation(this.type, this.value, this.start, this.offset).then((data) => {
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
    // if (this.isAgreedToTerms) {
    //   this.goToSlide(2);
    //   this.unlockSwipe();
    // } else {
    //   let toast = this.toastCtrl.create({
    //     message: "You should accept the terms and conditions before continuing",
    //     showCloseButton: true,
    //     closeButtonText: 'OK',
    //     duration: 2000,
    //     position: 'top'
    //   });
    //   toast.present();
    // }

    let termAlert = this.alertCtrl.create({
      title: 'Terms and Conditions',
      cssClass: 'alert-style',
      message: 'By continuing, you are agreeing to our terms and conditions',
      buttons: [
        {
          text: 'I Disagree',
          cssClass: 'alert-button-danger-plain',
          role: 'cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'I Agree',
          cssClass: 'alert-button-primary',
          handler: () => {
            this.unlockSwipe();
            this.goToSlide(1);
            this.lockSwipe();
          }
        }
      ]
    });
    termAlert.present();
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
