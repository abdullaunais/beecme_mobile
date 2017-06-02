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
export class UserService {

  http: Http;
  headers: Headers;
  options: RequestOptions;

  serviceRootUrl: string;

  REGISTER_URL = "/register";  // post
  GET_USER_URL = "/users/"; // +username, get
  AUTHENTICATE_LOGIN = "/auth" // post

  constructor(public httpService: Http, public config: Config) {
    this.http = httpService;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
    this.serviceRootUrl = config.serverUrl + "/delivery";
  }

  registerUser(user): Promise<any> {
    let body = JSON.stringify(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let requestUrl: string = this.serviceRootUrl + this.REGISTER_URL;
    return this.http.post(requestUrl, body, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getUserDetails(email): Promise<any> {
    let requestUrl: string = this.serviceRootUrl + this.GET_USER_URL + "/" + email;
    return this.http.get(requestUrl, this.options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  authenticate(email, password): Promise<any> {
    let credentials = {
      username: email,
      password: password
    };
    let body = JSON.stringify(credentials);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let requestUrl: string = this.serviceRootUrl + this.AUTHENTICATE_LOGIN;
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
