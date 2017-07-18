import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ToastController, Events, PopoverController } from 'ionic-angular';
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
  activePage: any;

  city: any;
  user: any;
  profilepic: string;
  isLogin: boolean = false;
  cartCount: number;

  connected: Subscription;
  disconnected: Subscription;
  watchLogin: Subscription;
  watchCart: Subscription;

  pages: Array<{ title: string, component: any, color: string, icon: string, devide: boolean }>;

  constructor(
    public platform: Platform,
    private storage: Storage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private variables: Variables,
    private network: Network,
    public events: Events
  ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      {
        title: 'Categories',
        component: 'Categories',
        color: 'ui-theme',
        icon: 'apps',
        devide: false
      },
      {
        title: 'My Cart',
        component: 'CartPage',
        color: 'primary',
        icon: 'cart',
        devide: false
      },
      {
        title: 'My Orders',
        component: 'OrderHistoryPage',
        color: 'green',
        icon: 'cash',
        devide: false
      },
      // { title: 'Sign In', component: 'UserLoginPage', color: 'danger', icon: 'person', devide: false },
      {
        title: 'Account',
        component: 'UserLoginPage',
        color: 'danger',
        icon: 'person',
        devide: false
      },
      {
        title: 'Settings',
        component: 'AppSettingsPage',
        color: 'blue-grey',
        icon: 'settings',
        devide: true
      },
      {
        title: 'About',
        component: 'AboutPage',
        color: 'blue-grey',
        icon: 'information-circle',
        devide: false
      }
    ];

    storage.get('location.set').then((locationSet) => {
      if (!locationSet) {
        this.rootPage = 'Welcome';
      } else {
        this.rootPage = 'Categories';
      }
    });

    this.refreshUser();

    storage.get('location.city').then((city) => {
      this.city = city;
    });
  }

  refreshUser() {
    this.storage.get('user.data').then((response) => {
      if (response) {
        if (response.email != undefined || response.email != null) {
          Variables.user.username = response.username;
          Variables.user.email = response.email;
          Variables.user.address = response.address;
          this.variables.setLogin(true);
          this.user = response;

          if (response.profilePicture) {
            this.profilepic = response.profilePicture;
          } else {
            this.profilepic = "assets/img/cover/profile_default.webp";
          }

        } else {
          this.user = {};
          this.profilepic = "assets/img/cover/profile_default.webp";
          Variables.user.username = "";
          Variables.user.email = "";
          Variables.user.address = "";
          this.variables.setLogin(false);
        }
      } else {
        this.user = {};
        this.profilepic = "assets/img/cover/profile_default.webp";
        Variables.user.username = "";
        Variables.user.email = "";
        Variables.user.address = "";
        this.variables.setLogin(false);
      }
    });
  }



  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // StatusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#4527A0');
      this.splashScreen.hide();
      // this.platform.width() < 768 ? this.menuCtrl.close() : this.menuCtrl.open();

      this.storage.get('delivery.cartCount').then((data) => {
        if (data)
          if (!Number.isNaN(data))
            this.variables.setCartCount(data);
      });

      this.connected = this.network.onConnect().subscribe(data => {
        console.log(data);
      }, error => console.error(error));

      this.disconnected = this.network.onDisconnect().subscribe(data => {
        console.log(data);
        this.displayNetworkUpdate(data.type);
      }, error => console.error(error));

      this.watchLogin = this.variables.login.subscribe(value => this.isLogin = value);
      this.watchCart = this.variables.cartCount.subscribe(value => this.cartCount = value);
      this.events.subscribe("user:change", () => {
        this.refreshUser();
      });
    });
  }

  // ionViewDidEnter() {

  // }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
    this.watchLogin.unsubscribe();
    this.watchCart.unsubscribe();
    this.events.unsubscribe("user:change");
  }

  displayNetworkUpdate(connectionState: string) {
    // let networkType = this.network.type
    this.toastCtrl.create({
      message: `You are disconnected from the Internet. Check your connection`,
      duration: 3000
    }).present();
  }

  // presentPopover(myEvent: Event) {
  //   if (!myEvent) var myEvent = window.event;
  //   myEvent.cancelBubble = true;
  //   if (myEvent.stopPropagation) myEvent.stopPropagation();

  //   let popover = this.popoverCtrl.create('ProfilePopoverPage', { login: this.isLogin, user: this.user});
  //   popover.present({
  //     ev: myEvent
  //   });
  // }

  loginOrProfile() {
    let profileComp = {
      title: 'Profile',
      component: 'UserProfilePage',
      color: 'danger',
      icon: 'person',
      devide: false
    };
    let loginComp = {
      title: 'Login',
      component: 'UserLoginPage',
      color: 'danger',
      icon: 'person',
      devide: false
    }
    if (this.isLogin) {
      this.openPage(profileComp);
      this.menuCtrl.close();
    } else {
      this.openPage(loginComp);
      this.menuCtrl.close();
    }
  }

  openPage(page) {
    if (this.nav.getActive().id === page.component) {
      return;
    }

    // if (this.nav.getViewById(page.component)) { }

    if (page.title === 'Account') {
      if (this.isLogin) {
        page.component = 'UserProfilePage';
      } else {
        page.component = 'UserLoginPage';
      }
    }
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component === 'Categories') {
      this.nav.setRoot(page.component, { city: this.city });
    } else {
      this.nav.push(page.component, { city: this.city });
    }
    this.menuCtrl.close();
    this.activePage = page;
  }

  profilePicError(event) {
    event.target.src = "assets/img/cover/profile_default.webp";
  }

  public checkActivePage(page): boolean {
    return page === this.activePage;
  }
}
