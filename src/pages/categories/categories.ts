import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ItemList} from "../item_list/item_list";
import { DeliveryService } from '../../providers/delivery-service'

@Component({
  selector: 'categories',
  templateUrl: 'categories.html',
  providers: [DeliveryService]
})
export class Categories {

  itemListPage = ItemList;
  filterText:string = '';
  // categories: Array<{title: string, imageUrl: string, description: number, value:string }>;
  categories: Array<any> = [];
  rows: Array<any> = [];
  deliveryService : DeliveryService;
  selectedCategory:string;

  constructor(public navCtrl: NavController, private navParams: NavParams, delivery: DeliveryService) {
    this.deliveryService = delivery;
    this.initialize();
    // this.categories = [
    //   { title: 'Fish', imageUrl: "cover_sl.jpg", description: 3, value: "sl" },
    //   { title: 'Meat', imageUrl: "cover_sa.jpg",  description: 12, value: "sa" },
    //   { title: 'Fruits', imageUrl: "cover_sa.jpg",  description: 6, value: "qa"  },
    //   { title: 'Vegetables', imageUrl: "cover_sa.jpg",  description: 11, value: "uae"  },
    //   { title: 'Other', imageUrl: "cover_sl.jpg",  description: 1, value: "us"  }
    // ];

    console.log(navParams.data);
  }

  initialize() {
    this.deliveryService.getCategories().then((data) =>  {
      let json = JSON.stringify(data);
      this.categories = JSON.parse(json);
      this.rows = Array.from(Array(Math.ceil(this.categories.length / 2)).keys());
      console.info(this.categories);
    });
  }

}
