import { Injectable } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from '../../auth/api.config';
import * as moment from 'moment';

@Injectable()
export class SignalingQueryRecordService {

  apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig['signalingURL'];
  }

  getSignalingData(item): Observable<any> {
    let param = '?start=' + item['start'];
    param += '&length=' + item['length'];
      param += '&imsi=' + item['imsi'];
      param += '&startTime=' + (item['startTime'] ? moment(item['startTime']).format('YYYY-MM-DD HH:mm:ss') : '');
      param += '&endTime=' + (item['endTime'] ? moment(item['endTime']).format('YYYY-MM-DD HH:mm:ss') : '');
      param += '&userName=' + item['userName'];
    return this.http.get(this.apiURL + '/signaling-query-record/search' + param)
    .map(result => result.json())
    .catch(this.handleError);
    }

    signalingCheck(item): Observable<any> {
      return this.http.post(this.apiURL + '/signaling-query-record/save', item)
      .map(result => result.json())
      .catch(this.handleError);
    }

    saveConfig(item): Observable<any> {
      if (!item['_links']) {
        return this.http.post(this.apiURL + '/signaling-config', item)
        .map(result => result.json())
        .catch(this.handleError);
      } else {
        let id: String = item['_links']['self']['href'];
        id = id.substring(id.lastIndexOf('/') + 1);
        return this.http.patch(this.apiURL + '/signaling-config/' + id, item)
        .map(result => result.json())
        .catch(this.handleError);
      }
    }

    getConfig(): Observable<any>{
      return this.http.get(this.apiURL + '/signaling-config')
      .map( result => {
          return result.json()['_embedded']['signaling-config'][0] ||
          {tracebackPeriod : '' , downloadPeriod: ''};
      }).catch(this.handleError);
    }

    dateCompareTraceback(item): Observable<any> {
      let param = '?startTime=' + item['startTime'];
      param += '&tracebackPeriodLimit=' + item['tracebackPeriodLimit'];
      return this.http.get(this.apiURL + '/signaling-query-record/dateCompareTraceback' + param)
      .map( result => result.json())
      .catch(this.handleError);
    }

    downLoadData(item): void {
      const param = 'filePath=' + item['filePath'];
      window.open(this.apiURL + '/signaling-query-record/downloadLog?' + param);
    }

    dateCompareDownload(item): Observable<any> {
      let param = 'requestTime=' + item['requestTime'];
      param += '&downloadPeriodLimit=' + item['downloadPeriodLimit'];
      return this.http.get(this.apiURL + '/signaling-query-record/dateCompareDownload?' + param)
      .map( result => result.json())
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
