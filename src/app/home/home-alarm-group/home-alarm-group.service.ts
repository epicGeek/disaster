import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from '../../auth/api.config';
@Injectable()
export class HomeAlarmGroupService {
  private apiURL = '';
  private kpiCode = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
    this.kpiCode = apiConfig.kpiCode;
    console.log(apiConfig);
   }

  getCountAlarm(): Observable<any> {
      return this.http.get(this.apiURL + '/home-alarm')
      .map( result => result.json() )
      .catch(this.handleError);
  }

  getCountKpi(): Observable<any> {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
    this.kpiCode = apiConfig.kpiCode;
      return this.http.get(this.apiURL + '/home-kpi-list-with-code?kpiCode=' + this.kpiCode)
      .map( result => result.json() )
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
