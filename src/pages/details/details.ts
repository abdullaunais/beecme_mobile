import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';

/*
  Generated class for the Details page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

  @ViewChild(Content) content: Content;
  headerShow: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  ngAfterViewInit() {
    // let itemContent = document.getElementById('itemContent');
    // let yOffset = itemContent.offsetTop;
    // console.log(yOffset);

    // this.content.ionScroll.subscribe(($event: any) => {
    //   this.headerShow = $event.scrollTop > 300;
    // });
  }

}
