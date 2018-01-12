import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EquipmentNe } from '../unit-manage/equipment-ne';
import { APIConfig } from '../../auth/api.config';


@Injectable()
export class OneClickAccessService {
  private oneClickApiEndPoint: string;
  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.oneClickApiEndPoint = apiConfig['oneClickURL'];
    this.apiURL = apiConfig.apiURL;

  }

  getConsoleConnectionInstance(unitName): Observable<any[]> {
    return this.http.get(this.oneClickApiEndPoint + 
      'api/v1/console-connection-instance/search/findByLoginUnitNameOrderByStartTimeDesc?unitName='
      + unitName)
      .map(data => {
        return data.json()['_embedded']['console-connection-instance'];
      }).catch(this.handleError);
  }
  getTemplates(): Observable<any[]> {

    return this.http.get(this.apiURL + '/resource/dhss_web_template').map(
      data => {
        return data.json();
      }).catch(this.handleError);
  }

  getClickRole(): Observable<any[]> {

    return this.http.get(this.apiURL + '/role/resource/role_resource').map(
      data => {
        return data.json();
      }).catch(this.handleError);
  }

  findData(item): Observable<Response> {

    let params = '?page=' + item.page;
    params = params + '&size=' + item.size;
    params = params + '&queryNeType=' + item.queryNeType;
    params = params + '&queryNeName=' + item.queryNeName;
    params = params + '&queryUnitType=' + item.queryUnitType;
    params = params + '&paramStr=' + item.paramStr;

    return this.http.get(this.apiURL + '/query-equipment-unit-list/net/0' + params)
            .map( result => {
              return result.json();
            }).catch(this.handleError);
  }

  // 获取所有网元
  getNeList(): Observable<EquipmentNe[]> {
    return this.http.get(this.apiURL + '/system-ne-list/net/1').map(
      data => data.json() || []).catch(this.handleError);
  }
  generateConsoleLink(unitName: string): string {
    return unitName + '666';
  }
  // 获取所有类型
  getTypes(): Observable<any[]> {
    return this.http.get(this.apiURL + '/resource/neUnitType').map(
      data => data.json() || []).catch(this.handleError);
  }
  downloadLog(filePath): void {
    window.open(this.oneClickApiEndPoint + '/api/v1/download-log?filePath=' + filePath);
  }

  // 错误信息的回调方法
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

}
