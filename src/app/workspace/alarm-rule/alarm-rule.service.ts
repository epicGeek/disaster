import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from './../../auth/api.config';

@Injectable()
export class AlarmRuleService {

  apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }


  getAlarmRule(alarmRule: AlarmRule): Observable<AlarmRule[]> {
      return this.http.post(this.apiURL + '/alarm-rule/query', alarmRule)
      .map( result => {
        // console.log(result);
        return result.json();
      } )
      .catch(this.handleError);
    }

  // 获取所有类型
  getTypes(): Observable<any[]> {
    return this.http.get(this.apiURL + '/resource/neUnitType').map(
      data => {
        return data.json();
      }).catch(this.handleError);
  }
  exportAlarmRule(alarmRule: AlarmRule) {
      window.open(this.apiURL + '/alarm-rule/export-data-download?alarmNo=' + alarmRule.alarmNo + '&unitType=' + alarmRule.unitType);
  }


  getUploadUrl(): string {
    return this.apiURL + '/alarm-rule/upload';
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

export interface AlarmRule {
  id?: number;
  alarmNo?: string;
  faultId?: string;
  alarmContent?: string;
  alarmType?: string;
  probableCause?: string;
  alarmText?: string;
  releaseVersion?: number;
  alarmMeaning?: string;
  alarmDesc?: string;
  alarmName?: string;
  alarmLevelVd?: string;
  alarmLevel?: string;
  onEquipment?: string;
  onBusiness?: string;
  alarmStd?: string;
  handle?: number;
  handleDelay?: number;
  alarmRemark?: string;
  isActive?: boolean;
  notifyImmediately?: string;
  totalSumInterval?: number;
  totalSumLimit?: number;
  vipSumInterval?: number;
  vipSumLimit?: number;
  generalSumInterval?: number;
  generalSumLimit?: number;
  isImportant?: string;
  fromRow?: string;
  fromFile?: string;
  page?: number;
  size?: number;
  unitType?: string;
}
