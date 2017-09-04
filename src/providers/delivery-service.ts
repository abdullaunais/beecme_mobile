import { Injectable } from '@angular/core';
import { Config } from './config';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the DeliveryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class DeliveryService {

  http: Http;
  headers: Headers;
  options: RequestOptions;

  serviceRootUrl: string;

  LOCATION_URL = "/locations";
  SHOPS_URL = "/shops";
  CATEGORIES_URL = "/categories";
  ITEM_URL = "/items";
  SCHEDULES_URL = "/schedules";
  ORDER_URL = "/carts";
  REVIEW_URL = "/reviews"

  constructor(public httpService: Http, public config: Config) {
    this.http = httpService;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
    this.serviceRootUrl = config.serverUrl + "/delivery";
  }

  getLocation(type, value, start, offset): Promise<any> {
    let queryParams = "?type=" + type + "&value=" + value + "&start=" + start + "&offset=" + offset;
    let requestUrl: string = this.serviceRootUrl + this.LOCATION_URL + queryParams;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getShops(cityId, categoryId, start, offset): Promise<any> {
    let queryParams = "?type=71&value=" + cityId + "&value=" + categoryId + "&start=" + start + "&offset=" + offset;
    let requestUrl: string = this.serviceRootUrl + this.SHOPS_URL + queryParams;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getCategories(cityId): Promise<any> {
    let requestUrl: string = this.serviceRootUrl + this.CATEGORIES_URL + "/" + cityId;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getItemByShop(shopId, start, offset): Promise<any> {
    let queryParams = "?type=17&value=" + shopId + "&start=" + start + "&offset=" + offset;
    let requestUrl: string = this.serviceRootUrl + this.ITEM_URL + queryParams;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  findItem(itemCode) {
    let requestUrl: string = this.serviceRootUrl + this.ITEM_URL + "/" + itemCode;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getItemByCategory(category, start, offset): Promise<any> {
    let queryParams = "?type=11&value=" + category + "&start=" + start + "&offset=" + offset;
    let requestUrl: string = this.serviceRootUrl + this.ITEM_URL + queryParams;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getSchedules(cityId): Promise<any> {
    let requestUrl: string = this.serviceRootUrl + this.SCHEDULES_URL + "?city=" + cityId;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOrders(userId, start, offset): Promise<any> {
    let queryParams = "?type=32&value=" + userId + "&start=" + start + "&offset=" + offset;
    let requestUrl: string = this.serviceRootUrl + this.ORDER_URL + queryParams;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  addOrder(order, authToken): Promise<any> {
    let body = JSON.stringify(order);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken)
    let options = new RequestOptions({ headers: headers });

    let requestUrl: string = this.serviceRootUrl + this.ORDER_URL;
    return this.http.post(requestUrl, body, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  sendReview(review, authToken) {
    let body = JSON.stringify(review, authToken);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken)
    let options = new RequestOptions({ headers: headers });

    let requestUrl: string = this.serviceRootUrl + this.REVIEW_URL;
    return this.http.post(requestUrl, body, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
