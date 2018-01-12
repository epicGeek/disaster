import { Injectable } from '@angular/core';
import {
  Http, Response, Headers,
  ResponseContentType, RequestOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';


import '../../../rxjs-operator';
import { APIConfig } from '../../../auth/api.config';

@Injectable()
export class SmartResultFilterService {

  private apiURL = '';

  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }


  // 按任务下载
  jobDownLog(item, scheduleId): void {
    window.open(this.apiURL + '/downloadLog/download?job='
      + item.checkItemId + '&scheduleId=' + scheduleId + '&fileName=' + item.checkItemName);
  }

  // 按网元下载
  neDownLog(item,scheduleId) {
    window.open(this.apiURL + '/downloadLog/download?ne=' + item.neId + '&scheduleId=' + scheduleId + '&fileName=' + item.neName);

  }

  findSmartCheckResultList(scheduleId: number, type: string): Observable<any[]>{
    return this.http.get(this.apiURL + '/findSmartCheckResultList?scheduleId=' + scheduleId + '&type=' + type)
      .map(result => result.json())
      .catch(this.handleError);
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
