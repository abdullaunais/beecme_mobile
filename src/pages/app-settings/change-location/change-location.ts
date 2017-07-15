import { Component } from '@angular/core';
import { NavController, LoadingController, ViewController,  IonicPage, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DeliveryService } from "../../../providers/delivery-service";
import { Variables } from "../../../providers/variables";

/**
 * Generated class for the ChangeLocation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-change-location',
  templateUrl: 'change-location.html',
  providers: [DeliveryService]
})
export class ChangeLocation {
  countries: Array<any> = [];
  provinces: Array<any> = [];
  cities: Array<any> = [];

  selectedCountry: any;
  selectedProvince: any;
  selectedCity: any;

  prevCountry: any = {};
  prevProvince: any = {};
  prevCity: any = {};

  countrySet: boolean = false;
  provinceSet: boolean = false;
  citySet: boolean = false;

  type: number = 21;
  value: number = 1;
  start: number = 0;
  offset: number = 20;

  isLoading: boolean;
  isError: boolean;
  loading: any;
  constructor(
    public navCtrl: NavController,
    private deliveryService: DeliveryService,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    private variables: Variables,
    public events: Events
  ) {
    this.storage.get("location.set").then((set) => {
      if (set) {
        this.storage.get("location.country").then((country) => {
          this.prevCountry = country
        });
        this.storage.get("location.province").then((province) => this.prevProvince = province);
        this.storage.get("location.city").then((city) => this.prevCity = city);
      }
    });
    this.initialize();
  }

  initialize() {
    this.isLoading = true;
    this.isError = false;
    this.deliveryService.getLocation(this.type, this.value, this.start, this.offset).then((data) => {
      let json = JSON.stringify(data);
      this.countries = JSON.parse(json);
      this.isLoading = false;
      this.isError = false;
    }).catch(err => {
      this.isLoading = false;
      this.isError = true;
    });
  }

  countryChanged() {
    this.showLoading("Fetching Provinces...");
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
    this.showLoading("Fetching Cities...");
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
      this.storage.set('user.authToken', null);

      this.storage.set('delivery.cart', []);
      this.storage.set('delivery.cartCount', 0);

      this.variables.setCartCount(0);
      this.variables.setLogin(false);
      this.events.publish("user:change");
    }
    this.viewCtrl.dismiss({ success: true });
  }

  retryServer() {
    this.initialize();
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

}
