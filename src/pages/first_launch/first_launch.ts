import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'first_launch',
  templateUrl: 'first_launch.html'
})
export class FirstLaunch {

  filterText:string = '';
  countries: Array<{title: string, imageUrl: string, numCities: number, value:string }>;
  selectedCountry:string;

  constructor(public navCtrl: NavController) {

    this.countries = [
      { title: 'Sri Lanka', imageUrl: "cover_sl.jpg", numCities: 3, value: "sl" },
      { title: 'Saudi Arabia', imageUrl: "cover_sa.jpg",  numCities: 12, value: "sa" },
      { title: 'Qatar', imageUrl: "cover_sa.jpg",  numCities: 6, value: "qa"  },
      { title: 'UAE', imageUrl: "cover_sa.jpg",  numCities: 11, value: "uae"  },
      { title: 'USA', imageUrl: "cover_sl.jpg",  numCities: 1, value: "us"  }
    ];
  }

}
