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
  private headers: Headers;
  private options: RequestOptions;

  private serviceRootUrl: string;

  private readonly LOCATION_URL = '/locations';
  private readonly SHOP_URL = '/shops';
  private readonly CATEGORY_URL = '/categories';
  private readonly ITEM_URL = '/items';
  private readonly ITEM_SHOP_URL = '/shopitems';
  private readonly ORDER_URL = '/carts';
  private readonly REVIEW_URL = '/reviews';
  // private readonly DASHBOARD_COUNTS_URL = '/dashboard/counts';
  // private readonly SEARCH_URL = '/dashboard/search';


  constructor(private http: Http, public config: Config) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
    this.serviceRootUrl = config.getServerUrl();
  }

  getLocation(type, value, start, offset): Promise<any> {
    const queryParams = {
      type: type,
      value: value,
      start: start,
      offset: offset
    };
    const requestUrl: string = this.serviceRootUrl + this.LOCATION_URL + this.encodeQueryData(queryParams);
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getShops(cityId, categoryId, start, offset): Promise<any> {
    const queryParams = {
      type: 71,
      value: [cityId, categoryId],
      start: start,
      offset: offset
    };
    const requestUrl: string = this.serviceRootUrl + this.SHOP_URL + this.encodeQueryData(queryParams);
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getCategories(cityId): Promise<any> {
    const requestUrl: string = this.serviceRootUrl + this.CATEGORY_URL + `/ ${cityId}`;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getItemByShop(shopId, start, offset): Promise<any> {
    const queryParams = {
      start: start,
      offset: offset
    };
    const requestUrl: string = this.serviceRootUrl + this.ITEM_SHOP_URL + `/${shopId}` + this.encodeQueryData(queryParams);
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // findItem(itemCode) {
  //   const requestUrl: string = this.serviceRootUrl + this.ITEM_URL + `/${itemCode}`;
  //   return this.http.get(requestUrl, this.options).toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError);
  // }

  getItemByCategory(category, start, offset): Promise<any> {
    const queryParams = {
      type: 11,
      value: category,
      start: start,
      offset: offset
    };
    const requestUrl: string = this.serviceRootUrl + this.ITEM_URL + this.encodeQueryData(queryParams);
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // getSchedules(cityId): Promise<any> {
  //   const requestUrl: string = this.serviceRootUrl + this.SCHEDULES_URL + "?city=" + cityId;
  //   return this.http.get(requestUrl, this.options).toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError);
  // }

  getOrders(userId, start, offset): Promise<any> {
    const queryParams = {
      type: 32,
      value: userId,
      start: start,
      offset: offset
    };
    const requestUrl: string = this.serviceRootUrl + this.ORDER_URL + this.encodeQueryData(queryParams);
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

    const requestUrl: string = this.serviceRootUrl + this.ORDER_URL;
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

    const requestUrl: string = this.serviceRootUrl + this.REVIEW_URL;
    return this.http.post(requestUrl, body, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private encodeQueryData(data: any): string {
    return '?' + Object.keys(data).map((key) => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
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
