import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'item_list',
  templateUrl: 'item_list.html'
})
export class ItemList {

  category:string = '';
  items: Array<{title: string, desc:string, imageUrl: string, price: number }>;
  searchQuery:string;
  filters: Array<string>;

  constructor(public navCtrl: NavController,  public navParams: NavParams) {

    this.items = [
      { title: 'Carrot', desc: "healthy food for anyone", imageUrl: "cover_sl.jpg", price: 3, },
      { title: 'Carrot', desc: "healthy food for anyone", imageUrl: "cover_sl.jpg", price: 3, },
      { title: 'Carrot', desc: "healthy food for anyone", imageUrl: "cover_sl.jpg", price: 3, },
      { title: 'Carrot', desc: "healthy food for anyone", imageUrl: "cover_sl.jpg", price: 3, },
      { title: 'Carrot', desc: "healthy food for anyone", imageUrl: "cover_sl.jpg", price: 3, },
      { title: 'Carrot', desc: "healthy food for anyone", imageUrl: "cover_sl.jpg", price: 3, }
    ];

    console.log(navParams.data)

  }

}
