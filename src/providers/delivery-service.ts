import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Config } from './config';
import 'rxjs/add/operator/map';


/*
  Generated class for the DeliveryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class DeliveryService {

  http: Http;
  data: any;
  serviceRootUrl: string;

  LOCATION_URL = "/locations";
  CATEGORIES_URL = "/categories";
  ITEM_URL = "/items";
  SCHEDULES_URL = "/schedules";
  ADD_ORDER = "/carts"

  constructor(public httpService: Http, public config: Config) {
    this.http = httpService;
    this.data = null;
    this.serviceRootUrl = config.serverUrl + "/delivery";
  }

  getLocation(type, value, start, offset) {
    let queryParams = "?type=" + type + "&value=" + value + "&start=" + start + "&offset=" + offset;
    let requestUrl: string = this.serviceRootUrl + this.LOCATION_URL + queryParams;
    return new Promise((resolve) => {
      this.http.get(requestUrl)
        .subscribe(data => {
          resolve(data.json());
        });
    },);
  }

  getCategories(cityId) {
    let requestUrl: string = this.serviceRootUrl + this.CATEGORIES_URL + "/" + cityId;
    return new Promise(resolve => {
      this.http.get(requestUrl)
        .subscribe(data => {
          resolve(data.json());
        });
    });
  }

  getItemByCategory(category, start, offset) {
    let queryParams = "?type=11&value=" + category + "&start=" + start + "&offset=" + offset;
    let requestUrl: string = this.serviceRootUrl + this.ITEM_URL + queryParams;
    return new Promise(resolve => {
      this.http.get(requestUrl)
        .subscribe(data => {
          resolve(data.json());
        });
    });
  }

  getSchedules(cityId) {
    let requestUrl: string = this.serviceRootUrl + this.SCHEDULES_URL + "?city=" + cityId;
    return new Promise(resolve => {
      this.http.get(requestUrl)
        .subscribe(data => {
          resolve(data.json());
        });
    });
  }

  addOrder(order, authToken) {
    let body = JSON.stringify(order);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken)
    let options = new RequestOptions({ headers: headers });

    let requestUrl: string = this.serviceRootUrl + this.ADD_ORDER;
    return new Promise(resolve => {
      this.http.post(requestUrl, body, options)
        .subscribe(data => {
          resolve(data);
        }, err => {
          resolve(err);
        });
    });
  }
}
