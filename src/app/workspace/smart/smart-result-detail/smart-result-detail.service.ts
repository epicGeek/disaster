import { Injectable } from '@angular/core';
import {
  Http, Response, Headers,
  ResponseContentType, RequestOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import '../../../rxjs-operator';
import { APIConfig } from '../../../auth/api.config';

@Injectable()
export class SmartResultDetailService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  downloadLog(item): void {
    window.open(this.apiURL + '/downloadLog/download?id=' + item.id + '&fileName=' + item.unitName);
  }

  export(scheduleId, job, ne, resultCode, unitType, unitName,
    startTime, endTime, checkItemName) {
    startTime = startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    window.open(this.apiURL + '/donwload/smartCheckDetailPageList/download?' +

      'scheduleId=' + scheduleId + '&checkItemId=' + job +

      '&neId=' + ne +

      '&resultCode=' + resultCode +

      '&unitType=' + unitType +

      '&unitName=' + unitName +

      '&startTime=' + startTime +

      '&endTime=' + endTime +

      '&checkItemName=' + checkItemName);
  }

  getSmartCheckResultPage(scheduleId, job, ne, resultCode, unitType,
    unitName, startTime, endTime, checkItemName, page, size): Observable<any> {
    startTime = startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    return this.http.get(this.apiURL + '/findResultPage?' +

      'scheduleId=' + scheduleId +

      '&checkItemId=' + job +

      '&neId=' + ne +

      '&resultCode=' + resultCode +

      '&unitType=' + unitType +

      '&unitName=' + unitName +

      '&startTime=' + startTime +

      '&endTime=' + endTime +

      '&checkItemName=' + checkItemName +

      '&page=' + page + '&size=' + size + '&sort=startTime,desc'
    ).map(result => result.json()).catch(this.handleError);
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
