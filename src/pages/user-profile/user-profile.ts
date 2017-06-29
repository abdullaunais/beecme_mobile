import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
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
  authToken: any;
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
    private userService: UserService,
    private renderer: Renderer
  ) { }


  loadMap() {
    let latLng = new google.maps.LatLng(this.user.latitude, this.user.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 18,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map
    });
  }

  updateLocation() {
    this.showLoading("Updating Location...");
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      // console.info("Latitude -- ", resp.coords.latitude);
      // console.info("Longitude -- ", resp.coords.longitude);
      delete this.user.password;
      this.user.latitude = resp.coords.latitude;
      this.user.longitude = resp.coords.longitude;

      this.userService.updateUser(this.user, this.authToken).then((updateResponse) => {
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
      this.hideLoading();
      this.presentToast("Error getting location", 2000);
    });
  }

  ngOnInit() {
    // this.showLoading("Please wait...");
    this.storage.get("user.login").then((login) => {
      if (login) {
        this.storage.get("user.data").then((userData) => {
          this.user.profilePicture = userData.profilePicture;
          this.storage.get("user.authToken").then(token => {
            this.authToken = token;
          });
          this.userService.getUserDetails(userData.userId, userData.authToken).then(res => {
            let json = JSON.stringify(res);
            this.user = JSON.parse(json);
            this.userAddressElement = this.user.address.replace(/(?:\r\n|\r|\n)/g, '<br />');
            this.isLoading = false;
            this.refreshProfilePicture();
            this.loadMap();
            // this.hideLoading();
          }).catch(err => {
            // this.hideLoading();
            this.presentToast("Error fetching user data", 2000);
          });
        })
      } else {
        // this.hideLoading();
        this.navCtrl.setRoot('UserLoginPage', {redirect: "redirect-accountpage"});
        return;
      }
    });
  }

  ngAfterViewInit() {
    this.offsetHeight = document.getElementById('nav-content').offsetHeight;
    this.loadMap();
    this.refreshProfilePicture();
  }

  refreshProfilePicture() {
    if (this.user.profilePicture) {
      document.getElementById('headerImage').style.backgroundImage = "url(" + this.user.profilePicture + ")";
    } else {
      document.getElementById('headerImage').style.backgroundImage = "url('assets/img/cover/profile_default_grey.webp')";
    }
  }

  checkScroll(event) {
    let yOffset = document.getElementById('profile-content').offsetTop;
    if (event.scrollTop > yOffset - this.offsetHeight) {
      document.getElementById('header-content').classList.remove("profile-header");
      // document.getElementById('header-content').classList.add("profile-header-image");
    } else {
      document.getElementById('header-content').classList.add("profile-header");
      // document.getElementById('header-content').classList.remove("profile-header-image");
    }
  }

  choosePhoto() {

  }

  presentUpdateModal(property: string) {
    let updateProfileModal = this.modalCtrl.create('UpdateProfile', { property: property, user: this.user });
    updateProfileModal.present();
    updateProfileModal.onDidDismiss((data) => {
      if (data.success) {
        this.user = data.user;
        this.userAddressElement = this.user.address.replace(/(?:\r\n|\r|\n)/g, '<br />');
        let alert = this.alertCtrl.create({
          title: 'Success',
          cssClass: 'alert-style',
          message: property + ' change success.',
          buttons: [
            {
              text: 'OK',
              cssClass: 'alert-button-success',
              handler: () => {
                //ignore
              }
            }
          ]
        });
        alert.present();
      }
    });
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
      position: 'bottom'
    });
    toast.present();
  }
}
