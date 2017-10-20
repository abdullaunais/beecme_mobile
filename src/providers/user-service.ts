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
  private headers: Headers;
  private options: RequestOptions;

  private serviceRootUrl: string;

  private readonly REGISTER_URL = "/register";  // post
  private readonly GET_USER_URL = "/users"; // +username, get
  private readonly UPDATE_USER_URL = "/users"; // +email/reset
  private readonly AUTHENTICATE_LOGIN = "/auth"; // post
  private readonly FORGOT_PASSWORD = "/mails"; // post
  private readonly ADDRESS_URL = "/users/address"; //+userId
  private readonly UPLOAD_PICTURE = "/users/upload"; //+userId 

  constructor(private http: Http, public config: Config) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
    this.serviceRootUrl = config.getServerUrl();
  }

  registerUser(user): Promise<any> {
    let body = JSON.stringify(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    const requestUrl: string = this.serviceRootUrl + this.REGISTER_URL;
    return this.http.post(requestUrl, body, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  uploadPicture(userId, authToken, image): Promise<any> {
    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('Authorization', authToken);
    let options = new RequestOptions({ headers: headers });

    const requestUrl: string = this.serviceRootUrl + this.UPLOAD_PICTURE + "/" + userId
    return this.http.post(requestUrl, image, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getUserDetails(userId, authToken): Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);
    let options = new RequestOptions({ headers: headers });

    const requestUrl: string = this.serviceRootUrl + this.GET_USER_URL + "/" + userId;
    return this.http.get(requestUrl, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  updateUser(user, authToken): Promise<any> {
    let body = JSON.stringify(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);
    let options = new RequestOptions({ headers: headers });

    const requestUrl: string = this.serviceRootUrl + this.UPDATE_USER_URL + "/" + user.email + "/reset";
    return this.http.put(requestUrl, body, options).toPromise()
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

    const requestUrl: string = this.serviceRootUrl + this.AUTHENTICATE_LOGIN;
    return this.http.post(requestUrl, body, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  forgotPassword(email): Promise<any> {
    const request = {
      PASSWORD_RESET: 1,
      email: email,
      subject: 1
    };
    let body = JSON.stringify(request);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    const requestUrl: string = this.serviceRootUrl + this.FORGOT_PASSWORD;
    return this.http.post(requestUrl, body, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getAddressList(userId, authToken): Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);
    let options = new RequestOptions({ headers: headers });

    const requestUrl: string = this.serviceRootUrl + this.ADDRESS_URL + `/${userId}`;
    return this.http.get(requestUrl, options).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
