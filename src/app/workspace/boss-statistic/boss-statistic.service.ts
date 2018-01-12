import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Injectable()
export class BossStatisticService {

  bossApiEndPoint: string;
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.bossApiEndPoint = apiConfig['bossURL'];
  }
  getStatistic(paramMap): Observable<any> {
    let getUrl = this.bossApiEndPoint + '/boss/statistic';
    getUrl += '?hlrsn=' + paramMap.hlrsn;
    getUrl += '&grain=' + paramMap.grain;
    getUrl += '&businessType=' + paramMap.businessType;
    getUrl += '&startDate=' + moment(paramMap.startDate).format('YYYY-MM-DD HH:mm:ss');
    getUrl += '&endDate=' + moment(paramMap.endDate).format('YYYY-MM-DD HH:mm:ss');
    return this.http.get(getUrl)
    .map(resultData => {
      console.log(resultData);
      return resultData.json();
    }).catch(this.handleError);

  }
  getBusinessTypeDropdown(): Observable<any> {
    return this.http.get(this.bossApiEndPoint + '/boss/business')
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
