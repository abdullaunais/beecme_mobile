import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/*
  Generated class for the Variables provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Variables {
  public cartCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public notificationCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public static user: any = {};
  public login: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setLogin(isLoggedIn: boolean) {
    this.login.next(isLoggedIn);
  }

  setCartCount(count: number) {
    this.cartCount.next(count);
  }

  setNotificationCount(count: number) {
    this.notificationCount.next(count);
  }
}
