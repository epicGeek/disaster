import { Injectable } from '@angular/core';
import { APIConfig } from '../../auth/api.config';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MaintainOperation } from './MaintainOperation';
import { MaintainResult } from './MaintainResult';

@Injectable()
export class MaintainService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }
  private headers = new Headers({'Content-Type': 'application/json'});

   // 读取日志
  readAllLog(path,unitName): Observable<String> {
     return this.http.get(this.apiURL + '/maintain/read-log?path=' + path + '&unitName=' + unitName)
     .map( content => content.json())
     .catch(this.handleError);
  }

   // 获取所有执行结果详情
  getMaintainResultList(item): Observable<MaintainResult[]> {
    return this.http.get(this.apiURL + '/maintain/result?id=' + item.id)
    .map( data =>  data.json() || {})
    .catch(this.handleError);
  }

  addMaintainOperation(maintain): Observable<MaintainOperation> {
    return this.http.post(this.apiURL +　'/maintain-operation' , maintain)
    .map( result => result.json())
    .catch(this.handleError);
  }

  sendCmd(itemArray, operation): Observable<boolean> {
    const postData = { list: itemArray, operation: operation };
    return this.http.post(this.apiURL + '/maintain/send-cmd',postData)
    .map(result => result.json())
    .catch(this.handleError);
  }

  // 获取所有执行结果
  getMaintainOperationList(startTime: string, endTime: string, code: string, page, size): Observable<any> {
    return this.http.get(this.apiURL + '/maintain/operation?code='
    + code + '&startTime=' + startTime + '&endTime=' + endTime + '&page=' + page + '&size=' + size + '&sort=requestTime,desc')
    .map( data =>  data.json())
    .catch(this.handleError);
  }

  findDropdown(): Observable<any> {
    return this.http.get(this.apiURL + '/init-select')
    .map( result => result.json())
    .catch(this.handleError);
  }

  // 获取所有指令
  getCommandCheckItemList(filterParam: string): Observable<any[]> {

    return this.http.get(this.apiURL +
    '/search/check-list/commandGroup?type=' + filterParam.toUpperCase())
    .map( data => data.json() || {})
    .catch(this.handleError);
  }

  // 获取所有网元
  getNeList(): Observable<any[]> {
    return this.http.get(this.apiURL + '/system-ne-list/net/1')
    .map( data => data.json() || [])
    .catch(this.handleError);
  }

  // 获取所有单元
  getUnitList(): Observable<any[]> {
    return this.http.get(this.apiURL + '/query-equipment-unit-list/net/0?page=0&size=1000')
    .map( data => data.json() || [])
    .catch(this.handleError);
  }

  // 获取所有类型
  getTypes(): Observable<any[]> {
    return this.http.get(this.apiURL + '/resource/neUnitType')
    .map( data =>  data.json() || [])
    .catch(this.handleError);
  }

  getDownLog(id) {
      window.open(this.apiURL + '/maintainOperateion/downloadLog/' + id + '/download');
  }

  getDownLogByuuid(uuids) {
      window.open(this.apiURL + '/maintainOperateion/downloadLogByUuid/' + uuids + '/download');
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
