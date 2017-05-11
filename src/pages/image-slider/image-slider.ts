import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

/*
  Generated class for the ImageSlilder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-image-slider',
  templateUrl: 'image-slider.html'
})
export class ImageSliderPage {
  item:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageSlilderPage');
  }

  closeImages() {
    this.navCtrl.pop();
  }

}
