import { Component, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Variables } from "../../providers/variables";
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";

/**
 * Generated class for the CheckoutOptionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-checkout-options',
  templateUrl: 'checkout-options.html',
  providers: [UserService]
})
export class CheckoutOptionsPage {
  @ViewChildren('commentInput') commentInput;
  checkoutComment: string;
  loading: any;
  createAddress: boolean = false;
  selectedAddress: any;
  user: any;
  city: any;
  province: any;
  country: any;
  locationLabel: string = "";
  addressList: Array<any> = [];

  address: string;
  nickname: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private userService: UserService
  ) {
    this.storage.get('user.data').then(user => {
      this.user = user;
      this.initialize();
    });
    this.storage.get('location.city').then(city => {
      this.city = city;
      this.storage.get('location.province').then(province => {
        this.province = province;
        this.storage.get('location.country').then(country => {
          this.country = country;
          this.locationLabel = this.city.nameEn + ", " + this.province.nameEn;
        });
      });
    });
  }

  initialize() {
    this.showLoading("Fetching Addresses");
    this.userService.getAddressList(this.user.userId, this.user.authToken).then(data => {
      let json = JSON.stringify(data);
      this.addressList = JSON.parse(json);
      this.hideLoading();
    }).catch(err => {
      this.hideLoading();
    });
  }

  checkout() {
    Variables.checkoutComment = this.checkoutComment;
    if (this.createAddress) {
      let addressObj = {
        cityId: this.city.id,
        provinceId: this.province.id,
        countryId: this.country.id,
        nickName: this.nickname,
        street: this.address
      }
      this.navCtrl.push('OrderSummaryPage', { 
        comment: this.checkoutComment,
        address: addressObj,
        city: this.city,
        province: this.province,
        country: this.province
      });
    } else {
      let addressObj = {
        cityId:  this.selectedAddress.cityId,
        provinceId:  this.selectedAddress.provinceId,
        countryId:  this.selectedAddress.countryId,
        nickName: this.selectedAddress.nickName,
        street:  this.selectedAddress.street,
      }
      this.navCtrl.push('OrderSummaryPage', { 
        comment: this.checkoutComment,
        address: addressObj,
        city: this.city,
        province: this.province,
        country: this.country
      });
    }

  }

  toggleNew() {
    this.createAddress = !this.createAddress;
  }

  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      content: content,
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

  focusComment() {
    setTimeout(() => {
      this.commentInput['_results'][0].setFocus();
    }, 200)
  }
}
