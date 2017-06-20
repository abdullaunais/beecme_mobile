import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { UserService } from "../../providers/user-service";

declare var google;
/*
  Generated class for the UserProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
  providers: [UserService, Geolocation]
})
export class UserProfilePage {
  userAddressElement: any;
  loading: any;
  offsetHeight: number;
  user: any = {}

  hideNav: boolean = false;
  isLoading: boolean = true;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private geolocation: Geolocation,
    private userService: UserService
  ) { }


  loadMap() {
    let latLng = new google.maps.LatLng(this.user.latitude, this.user.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map
    });
  }

  updateLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.showLoading("Updating...");
      // resp.coords.latitude
      // resp.coords.longitude
      // console.info("Latitude -- ", resp.coords.latitude);
      // console.info("Longitude -- ", resp.coords.longitude);
      delete this.user.password;
      this.user.latitude = resp.coords.latitude;
      this.user.longitude = resp.coords.longitude;

      this.userService.updateUser(this.user).then((updateResponse) => {
        if (updateResponse.code === 1) {
          this.storage.set('user.data', this.user);
          let alert = this.alertCtrl.create({
            title: "Location Updated",
            message: 'New Delivery Location is updated.',
            cssClass: 'alert-style',
            buttons: [
              {
                text: 'OK',
                cssClass: 'alert-button-success',
                handler: () => {
                  this.hideLoading();
                  this.loadMap();
                }
              }
            ]
          });
          alert.present();
        } else {
          this.hideLoading();
          this.presentToast("Error in location update", 2000);
        }
      }).catch(err => {
        console.error(err);
        this.hideLoading();
      });

    }).catch((error) => {
      console.log('Error getting location', error);
      this.presentToast("Error getting location", 2000);
    });
  }

  ngOnInit() {
    this.storage.get("user.login").then((login) => {
      if (login) {
        this.storage.get("user.data").then((userData) => {
          this.user = userData;
          this.userAddressElement = this.user.address.replace(/(?:\r\n|\r|\n)/g, '<br />');
          console.log(this.user);
          this.isLoading = false;
        })
      } else {
        return;
      }
    });
  }

  checkScroll(event) {
    let yOffset = document.getElementById('profile-content').offsetTop;
    if (event.scrollTop > yOffset - this.offsetHeight) {
      document.getElementById('header-content').classList.remove("profile-header");
    } else {
      document.getElementById('header-content').classList.add("profile-header");
    }
  }

  choosePhoto() {
    
  }

  presentUpdateModal(property: string) {
    let updateProfileModal = this.modalCtrl.create('UpdateProfile', {property: property});
    updateProfileModal.present();
    updateProfileModal.onDidDismiss((data) => {
      if (data.success) {
        // let alert = this.alertCtrl.create({
        //   title: 'Success',
        //   cssClass: 'alert-style',
        //   message: 'Location Changed. Your cart and the login data is reset.',
        //   buttons: [
        //     {
        //       text: 'OK',
        //       cssClass: 'alert-button-success',
        //       handler: () => {
        //         //ignore
        //       }
        //     }
        //   ]
        // });
        // alert.present();
      }
    });
  }


  ionViewDidEnter() {
    this.offsetHeight = document.getElementById('nav-content').offsetHeight;
    setTimeout(() => {
      this.loadMap();
    }, 500);
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

  presentToast(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'OK',
      duration: duration,
      position: 'top'
    });
    toast.present();
  }
}
