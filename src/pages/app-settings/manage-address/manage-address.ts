import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from "../../../providers/user-service";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ManageAddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-manage-address',
  templateUrl: 'manage-address.html',
  providers: [UserService]
})
export class ManageAddressPage {
  isLoading: boolean;
  createAddress: boolean = false;
  locationLabel: string = "";
  addressList: Array<any> = [];

  address: string;
  nickname: string;
  user: any = {};
  city: any = {};
  province: any = {};
  country: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private userService: UserService
  ) {
    this.isLoading = true;
    this.storage.get('user.data').then(user => {
      this.user = user;
      this.initialize();
    });
  }

  getAddressFormat(addressObj): any {
    let addressString = addressObj.street + "\n" + this.locationLabel;
    return addressString.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

  initialize() {
    this.userService.getAddressList(this.user.userId, this.user.authToken).then(data => {
      let json = JSON.stringify(data);
      this.addressList = JSON.parse(json);
      this.storage.get('location.city').then(city => {
        this.city = city;
        this.storage.get('location.province').then(province => {
          this.province = province;
          this.storage.get('location.country').then(country => {
            this.country = country;
            this.locationLabel = this.city.nameEn + ", \n" + this.province.nameEn + ",\n" + this.country.nameEn + ".";
            this.isLoading = false;
          }).catch(err => {
            this.isLoading = false;
          });
        }).catch(err => {
          this.isLoading = false;
        });
      }).catch(err => {
        this.isLoading = false;
      });
    }).catch(err => {
      this.isLoading = false;
    });
  }
}
