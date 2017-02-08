import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Categories} from "../categories/categories";
import { DeliveryService } from '../../providers/delivery-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'first_launch',
  templateUrl: 'first_launch.html',
  providers: [DeliveryService]
})
export class FirstLaunch {

  categoryPage = Categories;
  deliveryService : DeliveryService;
  storage: Storage;

  countries: Array<any> = [];
  provinces: Array<any> = [];
  cities: Array<any> = [];

  selectedCountry: any;
  selectedProvince: any;
  selectedCity: any;

  countrySet : boolean = false;
  provinceSet : boolean = false;
  citySet : boolean = false;

  type : number = 21;
  value : number = 1;
  start : number = 0;
  offset : number = 20;

  constructor(public navCtrl: NavController, delivery: DeliveryService, storage: Storage) {
    this.deliveryService = delivery;
    this.initialize();
    this.storage = storage;

    storage.get('location.set').then((response) => {
      if(response) {
        console.log('Location Set');
        this.navCtrl.push(Categories);
      } else {
        console.log('Location Not Set');
      }
    });
    // this.countries = [{"id":1,"nameEn":"Saudi Arabia","nameAr":"Saudi Arabia"}];
    // this.provinces = [];
    // this.cities = [{"id":1,"nameEn":"Al Malaz","nameAr":"Al Malaz"},{"id":2,"nameEn":"Al Nasim","nameAr":"Al Nasim"}];
  }

  initialize() {
    this.deliveryService.getLocation(this.type, this.value, this.start, this.offset).then((data) =>  {
      let json = JSON.stringify(data);
      this.countries = JSON.parse(json);
    });
  }

  countryChanged() {
    this.type = 22;
    this.value = this.selectedCountry.id;
    this.deliveryService.getLocation(this.type, this.value, this.start, this.offset).then((data) =>  {
      let json = JSON.stringify(data);
      this.provinces = JSON.parse(json);
    });
    this.countrySet = true;
  }

  provinceChanged() {
    this.type = 24;
    this.value = this.selectedProvince.id;
    this.deliveryService.getLocation(this.type, this.value, this.start, this.offset).then((data) =>  {
      let json = JSON.stringify(data);
      this.cities = JSON.parse(json);
    });
    this.provinceSet = true;
  }

  cityChanged() {
    this.citySet = true;

    this.storage.set('location.country', this.selectedCountry);
    this.storage.set('location.province', this.selectedProvince);
    this.storage.set('location.city', this.selectedCity);
    this.storage.set('location.set', true);
  }
}
