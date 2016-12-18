import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'categories',
  templateUrl: 'categories.html'
})
export class Categories {

  filterText:string = '';
  categories: Array<{title: string, imageUrl: string, description: number, value:string }>;
  selectedCategory:string;

  constructor(public navCtrl: NavController) {

    this.categories = [
      { title: 'Fish', imageUrl: "cover_sl.jpg", description: 3, value: "sl" },
      { title: 'Meat', imageUrl: "cover_sa.jpg",  description: 12, value: "sa" },
      { title: 'Fruits', imageUrl: "cover_sa.jpg",  description: 6, value: "qa"  },
      { title: 'Vegetables', imageUrl: "cover_sa.jpg",  description: 11, value: "uae"  },
      { title: 'Other', imageUrl: "cover_sl.jpg",  description: 1, value: "us"  }
    ];
  }

}
