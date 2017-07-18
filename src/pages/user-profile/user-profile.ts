import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage, ToastController, ModalController, Events, ActionSheetController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
/*
  Generated class for the UserProfilePage.

  See http://ionicframework.com/docs/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
  providers: [UserService]
})
export class UserProfilePage {
  @ViewChild('img') img1: ElementRef;
  authToken: any;
  loading: any;
  offsetHeight: number;
  user: any = {}

  hideNav: boolean = false;
  isLoading: boolean = true;
  isError: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private userService: UserService,
    public events: Events
  ) {
    this.initialize();
  }

  initialize() {
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
            this.isError = false;
          }).catch(err => {
            this.isLoading = false;
            this.isError = true;
          });
        }).catch(getErr => {
          this.isLoading = false;
          this.isError = true;
        });
      } else {
        this.navCtrl.setRoot('UserLoginPage', { redirect: "redirect-accountpage" });
        return;
      }
    }).catch(loginErr => {
      this.isLoading = false;
      this.isError = true;
      this.navCtrl.setRoot('UserLoginPage', { redirect: "redirect-accountpage" });
    });
  }

  editProfile() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What to update?',
      buttons: [
        {
          text: 'Edit Profile Picture',
          icon: 'image',
          cssClass: 'action-theme-btn',
          handler: () => {
            this.triggerFileUpload(this.img1.nativeElement);
          }
        },
        {
          text: 'Edit Name',
          icon: 'person',
          cssClass: 'action-blue-btn',
          handler: () => {
            this.presentUpdateModal('Name');
          }
        },
        {
          text: 'Edit Phone',
          icon: 'call',
          cssClass: 'action-green-btn',
          handler: () => {
            this.presentUpdateModal('Phone');
          }
        },
        {
          text: 'Manage Address',
          icon: 'home',
          cssClass: 'action-blue-grey-btn',
          handler: () => {
            setTimeout(() => {
              this.navCtrl.push('ManageAddressPage');
            }, 200);
          }
        },
        {
          text: 'Cancel',
          icon: 'close-circle',
          cssClass: 'action-cancel-btn',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  triggerFileUpload(img: HTMLInputElement) {
    img.click();
  }

  chooseImage(img: HTMLInputElement) {
    this.showLoading("Uploading...");
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
            if (userObj) {
              userObj.profilePicture = this.user.profilePicture;
              this.storage.set('user.data', userObj).then(res => {
                // this.refreshProfilePicture();
                this.hideLoading();
                this.events.publish("user:change");
                this.presentToast("Profile picture updated.", 2000);
              }).catch(userSetErr => {
                this.hideLoading();
              });
            }
          }).catch(getDataErr => {
            this.hideLoading();
          });
        }).catch(getUsrErr => {
          this.hideLoading();
        });
      } else {
        this.hideLoading();
        this.presentToast("Error profile update.", 2000);
      }
    }).catch(err => {
      this.hideLoading();
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

  retryServer() {
    this.isError = false;
    this.isLoading = true;
    this.initialize();
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
