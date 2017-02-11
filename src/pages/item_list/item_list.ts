import { Component, ViewChild } from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';
import {DetailsPage} from "../details/details";
import {DeliveryService} from "../../providers/delivery-service";

@Component({
  selector: 'item_list',
  templateUrl: 'item_list.html',
  providers: [DeliveryService]
})
export class ItemList {

  @ViewChild(Content) content: Content;

  detailsPage = DetailsPage;
  searchVisible : boolean = false;

  category: any;
  items: Array<any> = [];
  searchQuery : string = '';
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
    this.deliveryService.getItemByCategory(catId, this.start, this.offset).then((data) =>  {
      if(data['itemlist']) {
        if(data['itemlist'].length > 0) {
          this.items = data['itemlist'];
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
    this.deliveryService.getItemByCategory(catId, this.start, this.offset).then((data) =>  {
      let itemArray = data['itemlist'];
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

  showSearch() {
    this.searchVisible = true;
    this.content.resize();
  }

  hideSearch() {
    this.searchVisible = false;
    this.content.resize();
  }

  onSearchTextEntered() {

  }

  onSearchCancel() {
    this.hideSearch();
  }
}
