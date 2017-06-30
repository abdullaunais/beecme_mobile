import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DeliveryService } from "../../../providers/delivery-service";
import { IStarRatingOnClickEvent, IStarRatingOnRatingChangeEven } from "../../../directives/star-rating/star-rating-struct";
import { StatusBar } from "@ionic-native/status-bar";


/**
 * Generated class for the OrderFeedback page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-order-feedback',
  templateUrl: 'order-feedback.html',
  providers: [DeliveryService]
})
export class OrderFeedback {
  user: any;
  loading: any;
  order: any = {};
  rating: number = 0;
  ratingText: string = "";
  authToken: any;
  onClickResult: IStarRatingOnClickEvent;
  onRatingChangeResult: IStarRatingOnRatingChangeEven;

  public reviewForm = this.fb.group({
    formReview: ["", [Validators.required]],
  });
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public fb: FormBuilder,
    private toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private deliveryService: DeliveryService,
    private storage: Storage,
    private statusBar: StatusBar
  ) {
    this.order = navParams.data.order;
    storage.get("user.authToken").then(token => {
      this.authToken = token;
    });
    this.statusBar.backgroundColorByHexString('#edc800');
  }

  onClick = ($event: IStarRatingOnClickEvent) => {
    console.log('onClick $event: ', $event);
    this.onClickResult = $event;
    this.rating = $event.rating;
    if (this.rating === 1) {
      this.statusBar.backgroundColorByHexString('#db3838');
    } else if (this.rating < 4) {
      this.statusBar.backgroundColorByHexString('#edc800');
    } else {
      this.statusBar.backgroundColorByHexString('#3f9542');
    }
  };

  onRatingChange = ($event: IStarRatingOnRatingChangeEven) => {
    console.log('onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
    this.rating = $event.rating;
    if (this.rating === 1) {
      this.statusBar.backgroundColorByHexString('#db3838');
    } else if (this.rating < 4) {
      this.statusBar.backgroundColorByHexString('#edc800');
    } else {
      this.statusBar.backgroundColorByHexString('#3f9542');
    }
  };

  validateReview() {
    let isValid: boolean = true;
    let message: string = "";

    if (this.reviewForm.controls.formReview.errors) {
      if (this.reviewForm.controls.formReview.errors.required) {
        isValid = false;
        message = "Review is required";
      }
    }

    if (!isValid) {
      this.presentToast(message, 2000);
      return;
    } else {
      this.ratingText = this.reviewForm.value.formReview;
      this.updateReview();
    }
  }

  updateReview() {
    this.showLoading("Saving...");
    let reviewObj = {
      "commentEn": this.ratingText,
      "commentAr": this.ratingText,
      "rating": this.rating,
      "userId": this.order.orderHeader.userId,
      "shopId": this.order.orderHeader.shopId
    }
    this.deliveryService.sendReview(reviewObj, this.authToken).then(res => {
      if (res.code === 1) {
        this.hideLoading();
        this.statusBar.backgroundColorByHexString('#4527A0');
        this.viewCtrl.dismiss({ success: true });
      } else {
        this.hideLoading();
        this.statusBar.backgroundColorByHexString('#4527A0');
        this.viewCtrl.dismiss({ success: false });
      }
    }).catch(err => {
      this.presentToast("Error saving review", 2000);
      this.hideLoading();
      this.statusBar.backgroundColorByHexString('#4527A0');
      this.viewCtrl.dismiss({ success: false });
    });
  }

  cancelView() {
    this.statusBar.backgroundColorByHexString('#4527A0');
    this.viewCtrl.dismiss({success: false});
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
      duration: duration
    });
    toast.present();
  }
}
