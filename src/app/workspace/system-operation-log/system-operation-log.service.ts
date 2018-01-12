import { Injectable } from '@angular/core';
import { APIConfig } from '../../auth/api.config';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
@Injectable()
export class SystemOperationLogService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }
  findSystemOperationLogByCondition(item): Observable<SysSystemOperationLog[]> {

    let params = '?page=' + item.page;
    params = params + '&size=' + item.size;
    params = params + '&startDate=' + moment(item.startDate).format('YYYY-MM-DD HH:mm:ss');
    params = params + '&endDate=' + moment(item.endDate).format('YYYY-MM-DD HH:mm:ss');
    params = params + '&userName=' + item.userName;
    return this.http.get(this.apiURL + '/query-system-operation-log' + params)
    .map(resultData => resultData.json()).catch(this.handleError);
  }

  querySystemOperationLogFromRemote(searchParam): Observable<any[]> {
      let params = '?token=' + searchParam.token;
      params += '&starTime=' + searchParam.starTime;
      params += '&endTime=' + searchParam.endTime;
      params += '&userName=' + searchParam.username;
      return this.http.get(this.apiURL + '/query-system-operation-log-remote' + params)
    .map(resultData => resultData.json()).catch(this.handleError);
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
export interface SysSystemOperationLog {
  projectName?: string;

  moduleName?: string;

  userName?: string;

  operationTime?: string;

  operation?: string;

}
