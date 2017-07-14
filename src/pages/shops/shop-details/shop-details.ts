import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ShopDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shop-details',
  templateUrl: 'shop-details.html',
})
export class ShopDetailsPage {
  shop: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public renderer: Renderer
  ) {
    this.shop = navParams.data.shop;
    console.log(this.shop);
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'shop-details-popup', true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopDetailsPage');
  }

}
