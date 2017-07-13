import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
/*
  Generated class for the UserProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
  providers: [UserService]
})
export class UserProfilePage {
  authToken: any;
  loading: any;
  offsetHeight: number;
  user: any = {}

  hideNav: boolean = false;
  isLoading: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private userService: UserService
  ) { }

  ngOnInit() {
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
            this.isLoading = false;
            this.refreshProfilePicture();
          }).catch(err => {
            this.presentToast("Error fetching user data", 2000);
          });
        })
      } else {
        this.navCtrl.setRoot('UserLoginPage', { redirect: "redirect-accountpage" });
        return;
      }
    });
  }

  ngAfterViewInit() {
    this.offsetHeight = document.getElementById('nav-content').offsetHeight;
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
    } else {
      document.getElementById('header-content').classList.add("profile-header");
    }
  }

  triggerFileUpload(img: HTMLInputElement) {
    img.click();
  }

  chooseImage(img: HTMLInputElement) {
    let fileCount = img.files.length;
    let formData = new FormData(); // HTMLFormElement
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        formData.append('profilePicture', img.files.item(i));
      }
    }
    formData.append('userId', this.user.userId)
    this.userService.uploadPicture(this.user.userId, this.authToken, formData).then(res => {
      if (res.code === 1) {
          this.userService.getUserDetails(this.user.userId, this.user.authToken).then(res => {
            let json = JSON.stringify(res);
            this.user = JSON.parse(json);
            this.storage.get('user.data').then(userObj => {
              if(userObj) {
                userObj.profilePicture = this.user.profilePicture;
                this.storage.set('user.data', userObj).then(res => {
                  this.refreshProfilePicture();
                  this.presentToast("Profile picture updated.", 2000);
                }).catch(userSetErr => {
                  // ignore
                });
              }
            }).catch(getDataErr => {
              // ignore
            });
          }).catch(getUsrErr => {
            // ignore
          });
      }
    }).catch(err => {
      // console.log(JSON.stringify(err));
    });
  }

  presentUpdateModal(property: string) {
    let updateProfileModal = this.modalCtrl.create('UpdateProfile', { property: property, user: this.user });
    updateProfileModal.present();
    updateProfileModal.onDidDismiss((data) => {
      if (data.success) {
        this.user = data.user;
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
