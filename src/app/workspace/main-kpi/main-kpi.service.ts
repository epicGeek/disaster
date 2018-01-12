import { Injectable } from '@angular/core';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MainKpiService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  findKpiItemList(): Observable<SelectItem[]> {
    return this.http.get(this.apiURL + '/kpi-config/kpi-map')
    .map( result => result.json())
    .catch(this.handleError);
  }

  findDropdown(): Observable<any> {
    return this.http.get(this.apiURL + '/init-select')
    .map( result => result.json())
    .catch(this.handleError);
  }

  findCharData(kpiParams): Observable<any> {
    return this.http.post(this.apiURL + '/kpi-item/char-data', kpiParams)
    .map( result => result.json())
    .catch(this.handleError);
  }

  showMoreGrains(): Observable<any> {
    return this.http.get(this.apiURL + '/kpi-overview/grain')
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

export interface SelectItem {
  label?: string;
  value?: string;
  parent?: string;
}

export interface KpiParams {
  dhssName?: string;
  location?: string;
  neName?: string;
  kpiCode?: string;
  startDate?: string;
  endDate?: string;
  neType?: string;
  grain?: String;
}
