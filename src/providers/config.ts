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
    this.serverHost = "34.208.134.2"; // local: 192.168.0.102 // aws: 34.208.134.2
    this.serverPort = "8080";
    this.serverUrl = "http://" + this.serverHost + ":" + this.serverPort;
  }
}
