import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from './../../auth/api.config';

import * as moment from 'moment';
@Injectable()
export class AlarmMonitorService {

  apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  // testXml() : boolean{
  //   let path = "E:/dhlr-fusion-trunk/fusion-dhss-business-userdata/src/main/resources/soap/userRuleParse.xml";
  //   let xmlHttp:XMLHttpRequest = new XMLHttpRequest();
  //   xmlHttp.open("GET",path);
  //   xmlHttp.send();
  //   return true;
  //   // return this.http.get(path)
  //   // .map( result => { return result.json(); } )
  //   // .catch(this.handleError);
  // }

  cancelAlarm(record): Observable<any> {
      record['cancelTime'] = moment(record['cancelTime']).format('YYYY-MM-DD HH:mm:ss');
      return this.http.post(this.apiURL + '/cancelAlarm', record)
      .map(result => result.json())
      .catch(this.handleError);
  }

  removeAlarmNum(item): Observable<any> {
      let id: String = item['_links']['self']['href'];
      id = id.substring(id.lastIndexOf('/') + 1);
      return this.http.delete(this.apiURL + '/not-important-alarm/' + id)
      .map( result => result.json())
      .catch(this.handleError);
  }

  saveAlarmNum(item): Observable<{}> {
      item['createDate'] = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      return this.http.post(this.apiURL + '/not-important-alarm', item)
      .map( result => result.json())
      .catch(this.handleError);
  }

  saveOrUpdateNotAlarmNum(item: NotAlarmNum): Observable<NotAlarmNum> {
    if (item['_links']) {
      let id: String = item['_links']['self']['href'];
      id = id.substring(id.lastIndexOf('/') + 1);
      return this.http.patch(this.apiURL + '/not-important-alarm/' + id, item)
      .map( result => result.json())
      .catch(this.handleError);
    }else{
      return this.http.post(this.apiURL + '/not-important-alarm', item)
      .map( result => result.json())
      .catch(this.handleError);
    }

  }

  getNotAlarmNum(): Observable<NotAlarmNum[]> {
    return this.http.get(this.apiURL + '/not-important-alarm')
    .map( result => result.json()._embedded['not-important-alarm'] || [])
    .catch(this.handleError);
  }

   // 根据ID取消收藏
  getAlarmDesc(item): Observable<any[]> {
    let searchParam = '?alarmNo=' + item.alarmNo;
    searchParam += '&unitType=' + item.unitType;
    return this.http.get(this.apiURL + '/alarm-rule/search/findByAlarmNoAndUnitType' + searchParam).map(
                              result => {
                                return result.json();
                              }).catch(this.handleError);
  }

   // 根据ID取消收藏
  deleteItem(item: UserAlarm): Observable<Response> {
    return this.http.delete(this.apiURL + '/user-alarm-monitor/' + item.id).map(
                              (ok) => {
                                return true;
                              }).catch(this.handleError);
  }

  // 查询全部dhssName
  getDhssNameList(): Observable<any[]> {
      return this.http.get(this.apiURL + '/dhss-list/net/1')
      .map( result => result.json()['dhss'] )
      .catch(this.handleError);
  }

  // 查询告警
  getAlarmReceiveRecord(item: UserAlarm): Observable<AlarmReceiveRecord[]> {

    return this.http.post(this.apiURL + '/alarm-record', item)
    .map( result => result.json() )
    .catch(this.handleError);
  }

  // 获取用户收藏的list
  getUserAlarmParamList(): Observable<UserAlarm[]> {
    return this.http.get(this.apiURL + '/user-alarm-param?date=' + new Date())
    .map(result => result.json())
    .catch(this.handleError);
  }

  // 加入或者取消收藏
  joinOrCancelCollection(item: UserAlarm): Observable<boolean> {
    item.startTime = item.startTime ? moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') : item.startTime;
    item.endTime = item.endTime ? moment(item.endTime).format('YYYY-MM-DD HH:mm:ss') : item.endTime;
    return this.http.post(this.apiURL + '/collection', item)
    .map( result => result.json)
    .catch(this.handleError);
  }

  // 获取treenode
  getAllDhssNames(dhssName: string, neName: string): Observable<TreeNode[]> {
    return this.http.get(this.apiURL + '/alarm-dhss?dhssName=' + dhssName + '&neName=' + neName)
    .map( list => list.json())
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

// 用户收藏
export interface UserAlarm {
  id?: number;
  unitName?: string;
  cnum?: string;
  startTime?: string;
  endTime?: string;
  createTime?: Date;
  alarmNum?: string;
  keyword?: string;
  alarmDesc?: string;
  userName?: string;
  isCollection?: boolean;
  notAlarmNo?: string;
}

export interface AlarmReceiveRecord {
  id?: number;
  notifyId?: string;
  alarmLevel?: string;
  alarmNo?: string;
  alarmCell?: string;
  startTime?: string;
  cancelTime?: string;
  neName?: string;
  neCode?: string;
  receiveStartTime?: Date;
  userInfo?: string;
  alarmText?: string;
  supplInfo?: string;
  diagInfo?: string;
  objInfo?: string;
  alarmDesc?: string;
  dhssName?: string;
}

export interface NotAlarmNum {
  alarmNoArray?: string;
}

