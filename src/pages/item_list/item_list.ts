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

}
