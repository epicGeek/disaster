import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';


@Injectable()
export class AlarmMonitorCustomService {

  messageCenterEndPoint = '';
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.messageCenterEndPoint = apiConfig['apiURL'];
  }

  // 获取monitor告警信息
  getAlarmMonitor(alarmMonitor: AlarmMonitor): Observable<AlarmMonitor[]> {
    alarmMonitor.startTime = alarmMonitor.startTime ?
      moment(alarmMonitor.startTime).format('YYYY-MM-DD HH:mm:ss') : alarmMonitor.startTime;
    alarmMonitor.endTime = alarmMonitor.endTime ?
      moment(alarmMonitor.endTime).format('YYYY-MM-DD HH:mm:ss') : alarmMonitor.endTime;
    return this.http.post(this.messageCenterEndPoint + '/alarm-monitor-custom', alarmMonitor)
      .map(result => result.json())
      .catch(this.handleError);
  }
  getUnits(): Observable<any[]> {
    return this.http.get(this.messageCenterEndPoint + '/init-select')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  getAlarmGroup(): Observable<any[]> {
    return this.http.get(this.messageCenterEndPoint + '/customized-alarm-group').map(result => {
      console.log(result.json()['_embedded']['customized-alarm-group']);
      return result.json()['_embedded']['customized-alarm-group'] || [];
    }).catch(this.handleError);
  }
  getAlarmMember(): Observable<any[]> {
    return this.http.get(this.messageCenterEndPoint + '/customized-alarm-member').map(result => {
      console.log(result.json()['_embedded']['customized-alarm-member']);
      return result.json()['_embedded']['customized-alarm-member'] || [];
    }).catch(this.handleError);
  }
  addGroup(groupName: string, groupDesc: string): Observable<any> {

    let alarmGroup: CustomizedAlarmGroup = new CustomizedAlarmGroup(groupName, groupDesc);
    return this.http.post(this.messageCenterEndPoint + '/customized-alarm-group', alarmGroup).map(
      resultData => {
         return Observable.of(true);
      }
    ).catch(this.handleError);
  }
  addMember(memberName: string,
    cellPhoneNumber: string,
    emailAddress: string,
    shortTextNoticeSelected: string,
    mailNoticeSelected: string): Observable<any> {
    const alarmMember: CustomizedAlarmMember = new CustomizedAlarmMember(
      memberName, cellPhoneNumber, emailAddress,
      shortTextNoticeSelected, mailNoticeSelected);
    return this.http.post(this.messageCenterEndPoint + '/customized-alarm-member', alarmMember).map(
      resultData => {
        return Observable.of(true);
      }
    ).catch(this.handleError);
  }

  deleteByUrl(alarmGroup): Observable<any> {
    let id: String = alarmGroup['_links']['self']['href'];
    id = id.substring(id.lastIndexOf('/') + 1);
    return this.http.delete(this.messageCenterEndPoint + '/customized-alarm-group/' + id).map(resultData => {
      return Observable.of(true);
    });
  }
  editGroup(editGroupUrl, editGroupName, editGroupDesc): Observable<any> {
    const alarmGroup: CustomizedAlarmGroup = new CustomizedAlarmGroup(editGroupName, editGroupDesc);
    return this.http.patch(editGroupUrl, alarmGroup).map(resultData => {
      return Observable.of(true);
    });
  }
  editMember(editMemberUrl, alarmMemberName, alarmMemberCellPhoneNumber,
    alarmMemberEmailAddresss, shortTextNoticeSelected, mailNoticeSelected): Observable<any>{
    const alarmMember: CustomizedAlarmMember =
      new CustomizedAlarmMember(alarmMemberName, alarmMemberCellPhoneNumber, alarmMemberEmailAddresss,
      shortTextNoticeSelected, mailNoticeSelected);
        return this.http.patch(editMemberUrl, alarmMember).map(resultData => {
      return Observable.of(true);
    });
}
  // 错误信息的回调方法
  private handleError(error: Response | any) {
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

export interface AlarmMonitor {
  id?: number;
  alarmContent?: string;
  alarmLevel?: string;
  alarmLimit?: string;
  alarmScene?: string;
  alarmTitle?: string;
  alarmType?: string;
  belongSite?: string;
  cancelTime?: string;
  filePath?: string;
  kpiCode?: string;
  kpiComparedMethod?: string;
  neName?: string;
  neType?: string;
  startTime?: string;
  unitName?: string;
  unitType?: string;
  endTime?: string;
  page?: number;
  size?: number;

}

export class CustomizedAlarmGroup {
  groupName: string;
  groupDesc: string;
  constructor(groupName: string, groupDesc: string) {
    this.groupName = groupName;
    this.groupDesc = groupDesc;
  }


}
export class CustomizedAlarmMember {
  memberName: string;
  cellPhoneNumber: string;
  emailAddress: string;
  isShortTextNotice: string;
  isEmailNotice: string;
  constructor(memberName: string, cellPhoneNumber: string, emailAddress: string, isShortTextNotice: string, isEmailNotice: string) {
    this.memberName = memberName;
    this.cellPhoneNumber = cellPhoneNumber;
    this.emailAddress = emailAddress;
    this.isShortTextNotice = isShortTextNotice;
    this.isEmailNotice = isEmailNotice;
  }
}
