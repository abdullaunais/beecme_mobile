import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController, AlertController } from 'ionic-angular';
import { DetailsPage } from "../details/details";
import { DeliveryService } from "../../providers/delivery-service";
import { Storage } from '@ionic/storage';
import { CartPage } from "../cart/cart";

@Component({
  selector: 'item_list',
  templateUrl: 'item_list.html',
  providers: [DeliveryService]
})
export class ItemList {

  @ViewChild(Content) content: Content;

  detailsPage = DetailsPage;
  searchVisible: boolean = false;

  category: any;
  items: Array<any> = [];
  searchQuery: string = '';
  filters: Array<string>;

  start: number = 0;
  offset: number = 10;
  cityId: number = 1;

  deliveryService: DeliveryService;
  storage: Storage;

  cartCount: number;
  isLoading: boolean;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    delivery: DeliveryService,
    storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    this.deliveryService = delivery;
    this.storage = storage;
    this.isLoading = true;
    this.category = navParams.data;
    storage.get('delivery.cartCount').then((data) => {
      if (data) {
        this.cartCount = data;
      }
    });

    this.initialize();
  }

  initialize() {
    let catId = this.category['categoryId'];
    this.deliveryService.getItemByCategory(catId, this.start, this.offset).then((data) => {
      if (data['itemlist']) {
        if (data['itemlist'].length > 0) {
          this.items = data['itemlist'];
        } else {
          this.items = [];
        }
      } else {
        this.items = [];
      }
      this.isLoading = false;
      console.info("List Response -> ", data);
    });
  }

  refreshList(refresher) {
    let catId = this.category['categoryId'];
    this.deliveryService.getItemByCategory(catId, 0, this.offset).then((data) => {
      if (data['itemlist']) {
        if (data['itemlist'].length > 0) {
          this.items = data['itemlist'];
        } else {
          this.items = [];
        }
      } else {
        this.items = [];
      }
      refresher.complete();
    });
  }

  paginate() {
    let catId = this.category['categoryId'];
    this.start = this.start + this.offset;
    this.deliveryService.getItemByCategory(catId, this.start, this.offset).then((data) => {
      let itemArray = data['itemlist'];
      if (itemArray) {
        if (itemArray.length > 0) {
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

  selectQuantity(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Quantity',
      buttons: [
        {
          text: '1',
          role: '1',
          handler: () => {
            this.addToCart(1, item);
          }
        },
        {
          text: '2',
          handler: () => {
            this.addToCart(2, item);
          }
        },
        {
          text: '3',
          handler: () => {
            this.addToCart(3, item);
          }
        },
        {
          text: '4',
          handler: () => {
            this.addToCart(4, item);
          }
        },
        {
          text: '5',
          handler: () => {
            this.addToCart(5, item);
          }
        },
        {
          text: 'More than 5',
          handler: () => {
            this.quantityPrompt(item);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  addToCart(quantity, item) {
    let prompt = this.alertCtrl.create({
      title: 'Enter Comment',
      message: "",
      inputs: [
        { name: 'comment', placeholder: 'Comment' },
      ],
      buttons: [
        { text: 'Cancel', handler: data => { } },
        {
          text: 'Save',
          handler: data => {
            // if(item.qty >= quantity) {
            item.comment = data.comment;
            item.quantity = quantity;
            this.storage.get('delivery.cart').then((cart) => {
              let cartItems: Array<any> = cart;
              cartItems.push(item);
              this.storage.set('delivery.cart', cartItems).then((response) => {
                this.storage.set('delivery.cartCount', cartItems.length).then((res) => {
                  this.navCtrl.push(CartPage, null);
                });
              });
            });
            // } else {
            //   let alert = this.alertCtrl.create({
            //     title: 'Cant add more than the available amount!',
            //     subTitle: 'Please select a quantity that is available',
            //     buttons: ['OK']
            //   });
            //   alert.present();
            // }
          }
        }
      ]
    });
    prompt.present();
  }

  quantityPrompt(item) {
    let prompt = this.alertCtrl.create({
      title: 'Enter Quantity',
      message: "",
      inputs: [
        { name: 'quantity', placeholder: 'Quantity' },
      ],
      buttons: [
        { text: 'Cancel', handler: data => { } },
        {
          text: 'Add',
          handler: data => {
            this.addToCart(data.quantity, item);
          }
        }
      ]
    });
    prompt.present();
  }

  viewDetails(item) {
    this.navCtrl.push(DetailsPage, item, { animate: true, direction: "forward" });
  }

  openCart() {
    this.navCtrl.push(CartPage, null);
  }

}
