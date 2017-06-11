import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController } from 'ionic-angular';

/*
  Generated class for the OrderHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html'
})
export class OrderHistoryPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController
  ) {}
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad OrderHistoryPage');
  // }

  getActions(order: any) {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Quantity',
      buttons: [
        {
          text: 'Send Feedback',
          icon: 'star',
          cssClass: 'action-feedback-btn',
          handler: () => {
            console.log('Feedback Clicked');
          }
        },
        {
          text: 'Cancel',
          icon: 'close-circle',
          cssClass: 'action-cancel-btn',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

}
