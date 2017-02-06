import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Categories} from "../categories/categories";

@Component({
  selector: 'first_launch',
  templateUrl: 'first_launch.html'
})
export class FirstLaunch {

  categoryPage = Categories;

  countries: Array<any> = [];
  provinces: Array<any> = [];
  cities: Array<any> = [];

  selectedCountry: any;
  selectedProvince: any;
  selectedCity: any;

  constructor(public navCtrl: NavController) {
    // this.countries = [
    //   { title: 'Sri Lanka', imageUrl: "cover_sl.jpg", numCities: 3, value: "sl" },
    //   { title: 'Saudi Arabia', imageUrl: "cover_sa.jpg",  numCities: 12, value: "sa" },
    //   { title: 'Qatar', imageUrl: "cover_sa.jpg",  numCities: 6, value: "qa"  },
    //   { title: 'UAE', imageUrl: "cover_sa.jpg",  numCities: 11, value: "uae"  },
    //   { title: 'USA', imageUrl: "cover_sl.jpg",  numCities: 1, value: "us"  }
    // ];
    this.countries = [{"id":1,"nameEn":"Saudi Arabia","nameAr":"Saudi Arabia"}];
    this.provinces = [];
    this.cities = [{"id":1,"nameEn":"Al Malaz","nameAr":"Al Malaz"},{"id":2,"nameEn":"Al Nasim","nameAr":"Al Nasim"}];
  }

}
