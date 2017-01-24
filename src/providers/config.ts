import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the Config provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Config {

  serverHost : string;
  serverPort : string;
  serverUrl : string;

  constructor() {
    console.log('Hello Config Provider');
    this.serverHost = "localhost";
    this.serverPort = "8080";
    this.serverUrl = "http://" + this.serverHost + ":" + this.serverPort;
  }

}
