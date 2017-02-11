import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ItemList} from "../item_list/item_list";
import { DeliveryService } from '../../providers/delivery-service';
import { Storage } from '@ionic/storage';
import {FirstLaunch} from "../first_launch/first_launch";

@Component({
  selector: 'categories',
  templateUrl: 'categories.html',
  providers: [DeliveryService]
})
export class Categories {

  itemListPage = ItemList;
  filterText:string = '';
  selectedCity: any = null;
  storage : Storage;
  // categories: Array<{title: string, imageUrl: string, description: number, value:string }>;
  categories: Array<any> = [];
  rows: Array<any> = [];
  deliveryService : DeliveryService;
  selectedCategory:string;

  constructor(public navCtrl: NavController, private navParams: NavParams, delivery: DeliveryService, storage: Storage) {
    this.deliveryService = delivery;
    this.storage = storage;
    // this.categories = [
    //   { title: 'Fish', imageUrl: "cover_sl.jpg", description: 3, value: "sl" },
    //   { title: 'Meat', imageUrl: "cover_sa.jpg",  description: 12, value: "sa" },
    //   { title: 'Fruits', imageUrl: "cover_sa.jpg",  description: 6, value: "qa"  },
    //   { title: 'Vegetables', imageUrl: "cover_sa.jpg",  description: 11, value: "uae"  },
    //   { title: 'Other', imageUrl: "cover_sl.jpg",  description: 1, value: "us"  }
    // ];
    // storage.get('location.set').then((response) => {
    //   if(response) {
    //     storage.get('location.city').then((city) => {
    //       this.selectedCity = city;
    //       this.initialize();
    //     });
    //   } else {
    //     console.log('Location Not Set');
    //     this.navCtrl.push(FirstLaunch);
    //   }
    // });
    //
    // this.selectedCity = this.navParams.get('city');
    console.log(navParams.data);
    if(!navParams.data.locationSet) {
      storage.get('location.set').then((response) => {
          if(response) {
            storage.get('location.city').then((city) => {
              this.selectedCity = city;
              this.initialize();
            });
          } else {
            console.log('Location Not Set');
            this.navCtrl.push(FirstLaunch);
          }
        });
    } else {
      this.selectedCity = navParams.data.city;
      this.initialize();
    }
  }

  initialize() {
    this.deliveryService.getCategories(this.selectedCity.id).then((data) =>  {
      let json = JSON.stringify(data);
      this.categories = JSON.parse(json);
      this.rows = Array.from(Array(Math.ceil(this.categories.length / 2)).keys());
      console.info(this.categories);
    });
  }

}
