import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from '../../../auth/api.config';

import * as moment from 'moment';



@Injectable()
export class AlarmMonitorHistoryService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  exportAlarmReceiveHistory(alarmReceiveHistory: AlarmReceiveHistory): Observable<boolean>{
      alarmReceiveHistory.startTime = alarmReceiveHistory.startTime ?
            moment(alarmReceiveHistory.startTime).format('YYYY-MM-DD HH:mm:ss') : alarmReceiveHistory.startTime;
      alarmReceiveHistory.endTime = alarmReceiveHistory.endTime ?
            moment(alarmReceiveHistory.endTime).format('YYYY-MM-DD HH:mm:ss') : alarmReceiveHistory.endTime;
      let params = '?alarmUnit=' + (alarmReceiveHistory.alarmUnit ? alarmReceiveHistory.alarmUnit : '');
      params += '&alarmCell=' + (alarmReceiveHistory.alarmCell ? alarmReceiveHistory.alarmCell : '');
      params += '&notifyId=' + (alarmReceiveHistory.notifyId ? alarmReceiveHistory.notifyId : '');
      params += '&alarmNo=' + (alarmReceiveHistory.alarmNo ? alarmReceiveHistory.alarmNo : '');
      params += '&alarmLevel=' + (alarmReceiveHistory.alarmLevel ? alarmReceiveHistory.alarmLevel : '');
      params += '&startTime=' + (alarmReceiveHistory.startTime ? alarmReceiveHistory.startTime : '');
      params += '&endTime=' + (alarmReceiveHistory.endTime ? alarmReceiveHistory.endTime : '');
      window.open(this.apiURL + '/alarm-receive-history/download' + params , '_blank');
      return Observable.of(true);
  }


  // 查询历史告警
  getAlarmReceiveHistory(alarmReceiveHistory: AlarmReceiveHistory): Observable<AlarmReceiveHistory[]> {
    alarmReceiveHistory.startTime = alarmReceiveHistory.startTime ?
            moment(alarmReceiveHistory.startTime).format('YYYY-MM-DD HH:mm:ss') : alarmReceiveHistory.startTime;
    alarmReceiveHistory.endTime = alarmReceiveHistory.endTime ?
            moment(alarmReceiveHistory.endTime).format('YYYY-MM-DD HH:mm:ss') : alarmReceiveHistory.endTime;
    return this.http.post(this.apiURL + '/alarm-receive-history/query', alarmReceiveHistory)
    .map( result => result.json() )
    .catch(this.handleError);
  }

  // 告警描述
  getAlarmDesc(item): Observable<any> {
    let searchParam = '?alarmNo=' + item.alarmNo;
    searchParam += '&unitType=' + item.unitType;
    return this.http.get(this.apiURL + '/alarm-rule/search/findByAlarmNoAndUnitType' + searchParam)
      .map(result => result.json()).catch(this.handleError);
  }

  // 查询全部unitName
  getUnitNameList(): Observable<any[]> {
      return this.http.get(this.apiURL + '/equipment-unit')
      .map( result => result.json()['_embedded']['equipment-unit'] || [] )
      .catch(this.handleError);
  }


   // 错误信息的回调方法
  private handleError (error: Response | any) {
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



export interface AlarmReceiveHistory {
  id?: number;
  notifyId?: string;
  alarmLevel?: string;
  alarmNo?: string;
  alarmCell?: string;
  startTime?: string;
  cancelTime?: string;
  endTime?: string;
  neName?: string;
  neCode?: string;
  receiveStartTime?: Date;
  receiveCancelTime?: Date;
  dhssName?: string;
  alarmUnit?: string;
  page?: number;
  size?: number;
}
