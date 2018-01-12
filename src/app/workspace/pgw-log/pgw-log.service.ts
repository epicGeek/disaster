import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
@Injectable()
export class PgwLogService {
  pgwApiEndPoint: string;
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.pgwApiEndPoint = apiConfig['pgwURL'];
  }
  getDropdownData(): Observable<any> {
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/dropdown-data')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  queryPgwXmlText(requestId): Observable<any> {
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/pgw-xml-text' + '?requestId=' + requestId)
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  queryDropDownListData(): Observable<any> {
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/dropdown-data')
      .map(resultData => {

        return resultData.json();
      }).catch(this.handleError);
  }
  queryPgwLogByCondition(searchParams): Observable<PgwDetailData[]> {

    let params = '?pageNumber=' + searchParams.pageNumber;
    params += '&pageSize=' + searchParams.pageSize;
    params += '&pgwName=' + searchParams.pgwName;
    params += '&instanceName=' + searchParams.instanceName;
    params += '&resultType=' + searchParams.resultType;
    params += '&startDate=' + moment(searchParams.startDate).format('YYYY-MM-DD HH:mm:ss');
    params += '&endDate=' + moment(searchParams.endDate).format('YYYY-MM-DD HH:mm:ss');
    params += '&pgwQueryString=' + searchParams.pgwQueryString;
    params += '&keyword=' + searchParams.keyword;
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/query-data-table' + params)
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  queryPgwLogCountNumber(searchParams): Observable<number> {

    let params = '?pgwQueryString=' + searchParams.pgwQueryString;
    params += '&pgwName=' + searchParams.pgwName;
    params += '&instanceName=' + searchParams.instanceName;
    params += '&resultType=' + searchParams.resultType;
    params += '&startDate=' + moment(searchParams.startDate).format('YYYY-MM-DD HH:mm:ss');
    params += '&endDate=' + moment(searchParams.endDate).format('YYYY-MM-DD HH:mm:ss');
    params += '&keyword=' + searchParams.keyword;
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/query-data-table-count' + params)
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  exportPgwReport(searchParams) {

    let params = '?pgwQueryString=' + searchParams.pgwQueryString;
    params += '&pgwName=' + searchParams.pgwName;
    params += '&instanceName=' + searchParams.instanceName;
    params += '&resultType=' + searchParams.resultType;
    params += '&startDate=' + moment(searchParams.startDate).format('YYYY-MM-DD HH:mm:ss');
    params += '&endDate=' + moment(searchParams.endDate).format('YYYY-MM-DD HH:mm:ss');
    params += '&isExportLog=' + searchParams.isExportLog;
    params += '&keyword=' + searchParams.keyword;
    window.open(this.pgwApiEndPoint + '/pgw-log/pgw-export-report-download' + params);
  }

  getExportLimit() {
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/export-confirm')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  isSearchLogMode() {
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/search-log-mode')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  getOldestDate() {
    return this.http.get(this.pgwApiEndPoint + '/pgw-log/oldest-data-time')
    .map(resultData => {
      return resultData.json()['oldest'];
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
export interface PgwDetailData {
  responseTime?: string;
  pgwName?: string;
  userName?: string;
  instanceName?: string;
  requestId?: string;
  resultType?: string;
  errorCode?: string;
  errorMessage?: string;
  executionTime?: number;
  responseType?: string;

}
