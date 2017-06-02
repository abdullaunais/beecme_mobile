import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Variables } from "../providers/variables";
import { Network } from '@ionic-native/network';
import { Subscription } from "rxjs/Subscription";


@Component({
  templateUrl: 'app.html',
  providers: []
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  profileLabel: string;
  profilepic: string;
  isLogin: boolean = false;
  profileComponent: any;
  cartCount: number;

  connected: Subscription;
  disconnected: Subscription;
  watchLogin: Subscription;
  watchCart: Subscription;

  pages: Array<{ title: string, component: any, icon: string, devide: boolean }>;

  constructor(
    public platform: Platform,
    storage: Storage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private variables: Variables,
    private network: Network
  ) {
    this.initializeApp();

    storage.get('location.set').then((locationSet) => {
      if (!locationSet) {
        this.rootPage = 'Welcome';
      } else {
        this.rootPage = 'Categories';
      }
    });
    storage.get('user.data').then((response) => {
      if (response) {
        if (response.email != undefined || response.email != null) {
          Variables.user.username = response.username;
          Variables.user.email = response.email;
          this.variables.setLogin(true);
          this.profileLabel = Variables.user['username'];

          if (response.profilePicture) {
            this.profilepic = response.profilePicture;
          } else {
            this.profilepic = "assets/img/cover/profile_default.jpg";
          }

        } else {
          this.profileLabel = "";
          this.profilepic = "assets/img/cover/profile_default.jpg";
          Variables.user.username = "";
          Variables.user.email = "";
          this.variables.setLogin(false);
        }
      } else {
        this.profileLabel = "";
        this.profilepic = "assets/img/cover/profile_default.jpg";
        Variables.user.username = "";
        Variables.user.email = "";
        this.variables.setLogin(false);
      }


      if (this.isLogin) {
        this.profileComponent = {
          title: 'Profile', component: 'UserProfilePage', icon: 'person', devide: false
        }
      } else {
        this.profileComponent = {
          title: 'Sign In', component: 'UserLoginPage', icon: 'person', devide: false
        }
      }

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Categories', component: 'Categories', icon: 'apps', devide: false },
        { title: 'My Cart', component: 'CartPage', icon: 'cart', devide: false },
        { title: 'My Orders', component: 'OrderHistoryPage', icon: 'cash', devide: true },
        this.profileComponent,
        { title: 'Settings', component: 'AppSettingsPage', icon: 'settings', devide: false }
      ];
    });

    storage.get('delivery.cartCount').then((data) => {
      if (data)
        if (!Number.isNaN(data))
          this.variables.setCartCount(data);
    });




  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // StatusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#77bb11');
      this.splashScreen.hide();
    });
  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      console.log(data);
    }, error => console.error(error));

    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log(data);
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.watchLogin = this.variables.login.subscribe(value => this.isLogin = value);
    this.watchCart = this.variables.cartCount.subscribe(value => this.cartCount = value);
  }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
    this.watchLogin.unsubscribe();
    this.watchCart.unsubscribe();
  }

  displayNetworkUpdate(connectionState: string) {
    // let networkType = this.network.type
    this.toastCtrl.create({
      message: `You are disconnected from the Internet. Check your connection`,
      duration: 3000
    }).present();
  }

  loginOrProfile() {
    if (this.isLogin) {
      this.nav.push('UserProfilePage');
      this.menuCtrl.close();
    } else {
      this.nav.push('UserLoginPage');
      this.menuCtrl.close();
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
