import {Injectable} from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Config } from './config';
import 'rxjs/add/operator/map';


/*
 Generated class for the DeliveryService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

@Injectable()
export class UserService {

  http: Http;
  data: any;
  serviceRootUrl : string;

  REGISTER_URL = "/register";  // post
  GET_USER_URL = "/users/"; // +username, get
  AUTHENTICATE_LOGIN = "/auth" // post

  constructor(public httpService: Http, public config:Config) {
    this.http = httpService;
    this.data = null;
    this.serviceRootUrl = config.serverUrl + "/delivery";
  }

  registerUser(user) {
    let body = JSON.stringify(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let requestUrl : string = this.serviceRootUrl + this.REGISTER_URL;
    return new Promise(resolve => {
      this.http.post(requestUrl, body, options)
          .subscribe(data => {
            resolve(data.json());
          }, err => { 
            resolve(err.json());
          });
    });
  }

  getUserDetails(email) {
    let requestUrl : string = this.serviceRootUrl + this.GET_USER_URL + "/" + email;
    return new Promise(resolve => {
      this.http.get(requestUrl)
          .subscribe(data => {
            resolve(data.json());
          });
    });
  }

  authenticate(email, password) {
    let credentials = {
      username: email,
      password: password
    };
    let body = JSON.stringify(credentials);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let requestUrl : string = this.serviceRootUrl + this.AUTHENTICATE_LOGIN;
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
