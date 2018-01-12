import { Injectable } from '@angular/core';
import { APIConfig } from '../../auth/api.config';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class KpiConfigService {
  private kpiConfigData: KpiConfigData;
  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  getDropdownInfo(): Observable<any> {
    return this.http.get(this.apiURL + '/init-select')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  getResources(resourceFlag): Observable<any[]> {

    return this.http.get(this.apiURL + '/resource/' + resourceFlag)
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  getAllKpiConfig(): Observable<KpiConfigData[]> {

    return this.http.get(this.apiURL + '/kpi-config/get-all')
      .map(resultData => {
        console.log(resultData);
        return resultData.json();
      }).catch(this.handleError);
  }

  deleteKpiConfig(requestId): Observable<any> {
    return this.http.delete(this.apiURL + '/kpi-config/delete' + '?kpiConfigId=' + requestId)
      .map(result => {
        return result.json();
      }).catch(this.handleError);
  }

  editOrAddKpiConfig(addOrEditParams): Observable<any> {
    return this.http.post(this.apiURL + '/kpi-config/add-or-edit', addOrEditParams)
      .map(result => {

        return result.json();
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
export interface KpiConfigData {
  id?: number;
  kpiName?: string;
  kpiQueryScript?: string;
  kpiCategory?: string;
  comparedMethod?: string;
  monitorTimeString?: string;
  requestSample?: number;
  threshold?: number;
  thresholdCancel?: number;
}


