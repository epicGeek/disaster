import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Injectable()
export class BossMonitorService {
  bossApiEndPoint: string;
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.bossApiEndPoint = apiConfig['bossURL'];
  }
  exportData(paramMap) {
    let getUrl = this.bossApiEndPoint + '/boss/export/download';
    getUrl += '?';
    getUrl += 'hlrsn=' + paramMap.hlrsn;
    getUrl += '&errorCode=' + paramMap.errorCode;
    getUrl += '&operationName=' + paramMap.operationName;
    getUrl += '&resultType=' + paramMap.resultType;
    getUrl += '&startDate=' + moment(paramMap.startDate).format('YYYY-MM-DD HH:mm:ss');
    getUrl += '&endDate=' + moment(paramMap.endDate).format('YYYY-MM-DD HH:mm:ss');
    getUrl += '&numberString=' + paramMap.numberString;
    window.open(getUrl);
  }
  getBossDataByCondition(paramMap): Observable<any> {
    let getUrl = this.bossApiEndPoint + '/boss/data';
    getUrl += '?';
    getUrl += 'hlrsn=' + paramMap.hlrsn;
    getUrl += '&page=' + paramMap.pageNumber;
    getUrl += '&size=' + paramMap.pageSize;
    getUrl += '&errorCode=' + paramMap.errorCode;
    getUrl += '&operationName=' + paramMap.operationName;
    getUrl += '&resultType=' + paramMap.resultType;
    getUrl += '&startDate=' + moment(paramMap.startDate).format('YYYY-MM-DD HH:mm:ss');
    getUrl += '&endDate=' + moment(paramMap.endDate).format('YYYY-MM-DD HH:mm:ss');
    getUrl += '&numberString=' + paramMap.numberString;
    return this.http.get(getUrl)
    .map(resultData => {
      return resultData.json();
    }).catch(this.handleError);
  }
  getHlrsnDropDown(): Observable<any> {
    return this.http.get(this.bossApiEndPoint + '/boss/hlrsn')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  getCommandDropDown(): Observable<any> {
    return this.http.get(this.bossApiEndPoint + '/boss/command')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  getErrorCodeDropdown(): Observable<any> {
    return this.http.get(this.bossApiEndPoint + '/boss/errorcode')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  // 错误信息的回调方法
  private handleError(error: Response | any) {
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

