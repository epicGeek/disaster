import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EquipmentNe } from '../unit-manage/equipment-ne';
import { APIConfig } from '../../auth/api.config';


@Injectable()
export class UnitManageService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }
  headers = new Headers({'Content-Type': 'application/json'});

  getDropdownInfo(): Observable<any> {
    return this.http.get(this.apiURL + '/init-select')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  // 获取所有网元
  getNeList(): Observable<EquipmentNe[]> {
    return this.http.get(this.apiURL + '/system-ne-list/net/1')
      .map(data => data.json()).catch(this.handleError);
  }

  // 获取所有单元
  getUnitList(): Observable<any[]> {
    return this.http.get(this.apiURL + '/equipment-unit').map(
      data => {
        return data.json()['_embedded']['equipment-unit'] || {};
      }).catch(this.handleError);
  }

 saveOrEditEquipmentUnit(item): Observable<String> {
   return this.http.post(this.apiURL + '/addedit-equipment-unit', item)
            .map( result => result.json()).catch(this.handleError);

 }
  // 获取所有类型
  getTypes(): Observable<any[]> {
    return this.http.get(this.apiURL + '/resource/neUnitType').map(
      data => data.json()).catch(this.handleError);
  }

  exportUnit(item) {
    let params = '?queryNeType=' + item.queryNeType;

    params += '&queryNeName=' + item.queryNeName;

    params += '&queryUnitType=' + item.queryUnitType;

    params += '&paramStr=' + item.paramStr;

    params += '&token=' + localStorage.getItem('token');

    window.open(this.apiURL + '/equipment-unit-list/net/0/download' + params, '_blank');
  }


  findData(item): Observable<Response> {

    let params = '?page=' + item.page;

    params = params + '&size=' + item.size;

    params = params + '&queryNeType=' + item.queryNeType;

    params = params + '&queryNeName=' + item.queryNeName;

    params = params + '&queryUnitType=' + item.queryUnitType;

    params = params + '&paramStr=' + item.paramStr;

    params = params + '&sort=id,desc';

    return this.http.get(this.apiURL + '/query-equipment-unit-list/net/0' + params)
      .map(result => result.json())
      .catch(this.handleError);
  }

  removeData(item): Observable<any> {
    return this.http.delete(this.apiURL + '/equipment-unit/' + item.id)
      .map(result => result.json())
      .catch(this.handleError);
  }

  editData(item): Observable<any> {
    return this.http.patch(item['_links']['self']['href'], item)
    .map( result => result.json()).catch(this.handleError);
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
