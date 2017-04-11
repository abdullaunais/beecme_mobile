import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeliveryService } from '../../providers/delivery-service';
import { OrderSummaryPage } from "../order-summary/order-summary";
import { Storage } from "@ionic/storage";


/*
  Generated class for the DeliverySchedule page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-delivery-schedule',
  templateUrl: 'delivery-schedule.html',
  providers: [DeliveryService]
})
export class DeliverySchedulePage {

  deliveryService : DeliveryService;
  schedules : Array<any>;
  deliverySchedule : any;
  city: any;
  checkoutComment: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, delivery: DeliveryService, storage: Storage) {
    this.deliveryService = delivery;
    this.checkoutComment = navParams.data;
    storage.get("location.city").then((city) => {
      this.city = city;
      this.initialize();
    });
  }

  initialize() {
    this.deliveryService.getSchedules(this.city.id).then((data) =>  {
      let json = JSON.stringify(data);
      this.schedules = JSON.parse(json);
    });
  }

  deliveryScheduleChanged() {
    console.info("Selected Schedule -- ", this.deliverySchedule);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliverySchedulePage');
  }

  showOrderSummary() {
    this.navCtrl.push(OrderSummaryPage, this.deliverySchedule);
  }

}
