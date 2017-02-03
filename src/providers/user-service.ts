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
export class UserService {

  http: Http;
  data: any;
  serviceRootUrl : string;


  constructor(public httpService: Http, public config:Config) {
    this.http = httpService;
    this.data = null;
    this.serviceRootUrl = config.serverUrl + "/delivery";
  }
}
