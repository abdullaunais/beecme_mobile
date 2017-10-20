import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the Config provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Config {
  private readonly serverHost = '54.254.246.56'; // local: 192.168.0.102 // aws: 54.254.246.56
  private readonly serverPort = '8080';
  private readonly serverPath = 'delivery';
  private serverUrl: string;
  constructor() {
    this.serverUrl = `http://${this.serverHost}:${this.serverPort}/${this.serverPath}`;
  }

  getServerUrl() {
    return this.serverUrl;
  }
}
