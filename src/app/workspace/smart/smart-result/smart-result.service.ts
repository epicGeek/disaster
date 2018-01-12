import { Injectable } from '@angular/core';
import {
  Http, Response, Headers, ResponseContentType,
  RequestOptions, URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from '../../../auth/api.config';


import '../../../rxjs-operator';

@Injectable()
export class SmartResultService {
  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }


  jobResultLogDown(id): void {
    window.open( this.apiURL + '/downloadAllLog/download?scheduleId=' + id);
  }

  getSmartCheckResultList(startTime, endTime, jobName, page, size): Observable<any[]> {

    const searchParam = new URLSearchParams();
    searchParam.append('startTime', startTime);
    searchParam.append('endTime', endTime);
    searchParam.append('jobName', jobName);
    searchParam.append('page', page);
    searchParam.append('size', size);
    searchParam.append('sort', 'startTime,desc');
    return this.http.get(this.apiURL +
    '/smart-check-schedule-result/search/findSmartCheckScheduleResult', {search: searchParam}).map(result => {
            return result.json();
          }).catch(this.handleError);
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
