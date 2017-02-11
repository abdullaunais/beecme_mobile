import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
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
  serviceRootUrl : string;

  LOCATION_URL = "/locations?";
  CATEGORIES_URL = "/categories";
  ITEM_URL = "/items?";

  constructor(public httpService: Http, public config:Config) {
    console.log('Hello DeliveryService Provider');
    this.http = httpService;
    this.data = null;
    this.serviceRootUrl = config.serverUrl + "/delivery";
  }

  getLocation(type, value, start, offset) {
    let queryParams = "type="+type+"&value="+value+"&start="+start+"&offset="+offset;
    let requestUrl : string = this.serviceRootUrl + this.LOCATION_URL + queryParams;
    return new Promise(resolve => {
      this.http.get(requestUrl)
          .subscribe(data => {
            resolve(data.json());
          });
    });
  }

  getCategories(cityId) {
    let requestUrl : string = this.serviceRootUrl + this.CATEGORIES_URL + "/" + cityId;
    return new Promise(resolve => {
      this.http.get(requestUrl)
          .subscribe(data => {
            resolve(data.json());
          });
    });
  }

  getItemByCategory(category, start, offset) {
    let queryParams = "type=11&value="+category+"&start="+start+"&offset="+ offset;
    let requestUrl :string = this.serviceRootUrl + this.ITEM_URL + queryParams;
    return new Promise(resolve => {
      this.http.get(requestUrl)
          .subscribe(data => {
            resolve(data.json());
          });
    });
  }
}
