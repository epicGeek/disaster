import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Injectable()
export class VolteAlarmService {
  volteApiEndPoint: string;
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.volteApiEndPoint = apiConfig['volteURL'];
  }

  getDevices(): Observable<any> {
    return this.http.get(this.volteApiEndPoint + '/volte/dhssNames')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  getVolteAlarmData(paramMap): Observable<any> {
    let getUrl = this.volteApiEndPoint + '/volte/volte-alarm';
    getUrl += '?startTime=' + moment(paramMap.startTime).format('YYYY-MM-DD HH:mm:ss');
    getUrl += '&endTime=' + moment(paramMap.startTime).format('YYYY-MM-DD HH:mm:ss');
    getUrl += '&device=' + paramMap.device;
    return this.http.get(getUrl)
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
