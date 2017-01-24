import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config'
import {Observable} from 'rxjs/Observable';
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

  CATEGORIES_URL = "/categories";

  constructor(public httpService: Http, public config:Config) {
    console.log('Hello DeliveryService Provider');
    this.http = httpService;
    this.data = null;
    this.serviceRootUrl = config.serverUrl + "/delivery";
  }

  getCategories() {
    let requestUrl : string = this.serviceRootUrl + this.CATEGORIES_URL;
    return new Promise(resolve => {
      this.http.get(requestUrl)
          .subscribe(data => {
            resolve(data.json());
          });
    });
  }
}
