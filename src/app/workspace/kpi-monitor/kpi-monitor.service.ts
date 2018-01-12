import { Injectable } from '@angular/core';
import { APIConfig } from '../../auth/api.config';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class KpiMonitorService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }
  exportReport(searchParams): void {

    let urlParams = '?dhssName=' + searchParams.dhssName;
    urlParams += '&physicalLocation=' + searchParams.physicalLocation;
    urlParams += '&neType=' + searchParams.neType;
    urlParams += '&kpiType=' + searchParams.kpiType;
    urlParams += '&neName=' + searchParams.neName;
    urlParams += '&unitName=' + searchParams.unitName;
    urlParams += '&unitType=' + searchParams.unitType;
    urlParams += '&kpiName=' + searchParams.kpiName;
    urlParams += '&startTime=' + searchParams.startTime;
    urlParams += '&endTime=' + searchParams.endTime;
    urlParams += '&neString=' +  searchParams.neString;
    window.open(this.apiURL + '/kpi/kpi-export-report-download' + urlParams);
  }
  getKpiHistoryData(searchParams): Observable<any> {
    let urlParams = '?dhssName=' + searchParams.dhssName;
    urlParams += '&physicalLocation=' + searchParams.physicalLocation;
    urlParams += '&neType=' + searchParams.neType;
    urlParams += '&kpiType=' + searchParams.kpiType;
    urlParams += '&neName=' + searchParams.neName;
    urlParams += '&unitName=' + searchParams.unitName;
    urlParams += '&unitType=' + searchParams.unitType;
    urlParams += '&kpiName=' + searchParams.kpiName;
    urlParams += '&startTime=' + searchParams.startTime;
    urlParams += '&endTime=' + searchParams.endTime;
    urlParams += '&page=' + searchParams.page;
    urlParams += '&size=' + searchParams.size;
    urlParams += '&sort=periodStartTime,desc';
    return this.http.get(this.apiURL + '/kpi/history-data-list' + urlParams)
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  getUnitInfo(): Observable<any> {
    return this.http.get(this.apiURL + '/kpi/get-unit-data')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  getDropdownInfo(): Observable<any> {
    return this.http.get(this.apiURL + '/init-select')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  getKpiDropdownInfo(): Observable<any> {
    return this.http.get(this.apiURL + '/kpi-config/kpi-map')
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
