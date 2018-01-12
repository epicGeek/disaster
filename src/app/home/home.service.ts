import { Injectable, Inject } from '@angular/core';

import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import '../rxjs-operator';
import { HomeNavItem } from './model/home-nav-item';
import { HomeNavGroup } from './model/home-nav-group';
import { HomeAlarmItem } from './model/home-alarm-item';
import { RequestCmd } from './model/request-cmd';
import { APIConfig } from '../auth/api.config';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../core/config/config.service';

@Injectable()
export class HomeService {

  menuModel: {};
  menuItemList = [];

  private homeNavItemDataEndpoint = '';
  private homeAlarmItemDataEndpoint = '';
  private testEndPoint = '';

  constructor(private http: Http,
    private authService: AuthService,
    private configService: ConfigService) {
  }

  sendCmd(cmdArray: RequestCmd[]): Observable<boolean> {
    const data = {list: []};
    data.list = cmdArray;
    return this.http.post(this.testEndPoint, data)
    .map(result => {console.log(result); return result; })
    .catch(this.handleError);
  }

  getShowCount(): Boolean {
      const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
      return apiConfig['showCount'];
  }

  getHomeAlarmItemList(): Observable<HomeAlarmItem[]> {

    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.homeNavItemDataEndpoint = apiConfig.apiURL + '/home-nav-item';
    this.homeAlarmItemDataEndpoint = apiConfig.apiURL + '/home-alarm-item';
    this.testEndPoint = apiConfig.apiURL + '/maintain-send-cmd';
    return this.http.get(this.homeAlarmItemDataEndpoint)
           .map(response => response.json())
           .map(message => {console.log('aaa' + message); return message; })
           .map(re => re)
           .catch(this.handleError);
  }
  getCurrentDateTimeString(): string {
    return new Date().toLocaleDateString();
  }

  getHomeNavItemList(): Observable<HomeNavItem[]> {

    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.homeNavItemDataEndpoint = apiConfig.apiURL + '/home-nav-item';
    this.homeAlarmItemDataEndpoint = apiConfig.apiURL + '/home-alarm-item';
    this.testEndPoint = apiConfig.apiURL + '/maintain-send-cmd';
    return this.http.get(this.homeNavItemDataEndpoint)
    .map( this.exactMenuData )
    .catch(this.handleError);
  }

  getHomeNavItemListByGroupCode(groupName: string, groupDisplayName: string): Observable<HomeNavGroup> {

    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.homeNavItemDataEndpoint = apiConfig.apiURL + '/home-nav-item';
    this.homeAlarmItemDataEndpoint = apiConfig.apiURL + '/home-alarm-item';
    this.testEndPoint = apiConfig.apiURL + '/maintain-send-cmd';

    return this.http.get(this.homeNavItemDataEndpoint)
    .map( this.exactMenuData)
    .map((itemList) => {
      const menuGroup = new HomeNavGroup();
      menuGroup.groupName = groupName;
      menuGroup.groupDisplayName = groupDisplayName;
      const menuItem = itemList.filter((item) => {
        return item.groupName === groupName;
      });
    }).catch(this.handleError);
  }
  private exactMenuData(response: Response): HomeNavItem[] {
    return response.json();
  }
  private handleError (error: Response | any) {
  // In a real world app, we might use a remote logging infrastructure
  let errMsg: string;
  console.error(error);
  if (error instanceof Response) {
    const body = error.json() || '';

    const err = body.error || JSON.stringify(body);

    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Observable.throw(errMsg);
}
  // getAllHomeItems(): Observable<HomeItem[]> {
  //     return this.http.get(this.homeDataEndpoint)
  //     .map(response => response.json())
  //     .map(messages:Object[]) => {
  //         return messages.map(message => this.parseData(message));

  //     });
  //     return null;
  // }
}

