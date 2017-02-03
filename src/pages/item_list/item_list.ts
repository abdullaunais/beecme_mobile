import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DetailsPage} from "../details/details";
import {DeliveryService} from "../../providers/delivery-service";

@Component({
  selector: 'item_list',
  templateUrl: 'item_list.html',
  providers: [DeliveryService]
})
export class ItemList {

  detailsPage = DetailsPage;
  category: any;
  items: Array<any> = [];
  searchQuery:string;
  filters: Array<string>;

  start : number = 0;
  offset : number = 10;
  cityId : number = 1;

  deliveryService : DeliveryService;

  constructor(public navCtrl: NavController,  private navParams: NavParams, delivery: DeliveryService) {
    this.deliveryService = delivery;
    this.category = navParams.data;
    this.initialize();
  }

  initialize() {
    let catId = this.category['categoryId'];
    this.deliveryService.getItemByCityAndCategory(this.cityId, catId, this.start, this.offset).then((data) =>  {
      if(data['itemList']) {
        if(data['itemList'].length > 0) {
          this.items = data['itemList'];
        } else {
          this.items = [];
        }
      } else {
        this.items = [];
      }
      console.info("List Response -> ", data);
    });
  }

  paginate() {
    let catId = this.category['categoryId'];
    this.start = this.start + this.offset;
    this.deliveryService.getItemByCityAndCategory(this.cityId, catId, this.start, this.offset).then((data) =>  {
      let itemArray = data['itemList'];
      if(itemArray) {
        if(itemArray.length > 0) {
          itemArray.forEach((item) => {
            this.items.push(item);
          });
          console.info("Paginated -> ", this.items);
        } else {
          console.info("No more items remaining");
        }
      } else {
        console.info("No more items remaining");
      }

    });
  }
}
