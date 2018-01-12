import {Component, OnInit, OnDestroy} from '@angular/core';
import {SignalingQueryRecordService} from './signaling-query-record.service';
import {ConfirmationService} from 'primeng/primeng';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { AuthService} from '../../auth/auth.service';
import { QueryBindingType } from '@angular/core/src/view';
import * as moment from 'moment';


@Component({
  selector: 'ices-signaling-query-record',
  templateUrl: './signaling-query-record.component.html',
  styleUrls: ['./signaling-query-record.component.css']
})
export class SignalingQueryRecordComponent implements OnInit, OnDestroy {

  constructor(private signalingService: SignalingQueryRecordService) {

  }

  ngOnDestroy() {
    this.time = window.clearInterval(this.time);
  }

  ngOnInit() {
    this.getDownLoadPeriodLimit();
  }

  item = {};

  itemList = [];

  logDiv: Boolean = false;

  totalRecords = 0;

  signalingConfigDisplay: Boolean = false;

  checkResult = {};

  queryStartTime: string = '';

  queryStartTimeForCheck: string = '';

  queryEndTime: string = '';

  queryEndTimeForCheck: string = '';

  queryUserName: string = '';

  queryImsi: string = '';

  queryImsiForCheck: string = '';

  msgs = [];

  configURL: string = '';

  configEntity = {};

  userMessage = localStorage.getItem('userMessage').split(" ")[2];

  compareDateResult: string = '';

  comprarDownLoadLimitResult: string = '';

  time;

  n: number = 0;
    sendTime() {
        this.time = setInterval(() => {
          this.n ++;
          this.getSignalingData({first: 0, rows: 15});
          if(this.n === 10) {
              this.time = window.clearInterval(this.time);
          }
        }, 15000);
    }

  switchsBtn() {
    this.logDiv = this.logDiv ? false : true;
    this.resetQueryParam();
    this.getSignalingData({first: 0, rows: 15});
  };

  getSignalingData(event) {
    this.item = {start: event['first'], length: event['rows'], startTime: this.queryStartTime, endTime: this.queryEndTime, userName: this.queryUserName, imsi: this.queryImsi};
    this.signalingService.getSignalingData(this.item).subscribe(
      result => {
        this.totalRecords = result['iTotalRecords'];
          this.itemList = result['aaData'];
      }
    );
  }

  dateCompareTraceback() {
    this.signalingService.dateCompareTraceback({
                  startTime: (this.queryStartTimeForCheck ? moment(this.queryStartTimeForCheck).format('YYYY-MM-DD HH:mm:ss') : ''),
                   tracebackPeriodLimit: this.configEntity['tracebackPeriod']}).subscribe(
      result => {
        this.compareDateResult =  result['compareDateResult'];
        this.signalingCheck();
      }
    );
  }

  signalingBtn() {
    if (this.queryStartTimeForCheck === '') {
      this.showMessage('warn', 'startTime can not be empty');
      return;
    }
    this.dateCompareTraceback();
  }

  signalingCheck() {
    if (this.compareDateResult === 'false') {
      this.showMessage('warn', 'startTime exceeds the maximum backtracking time');
      return;
    }
    if (this.queryEndTimeForCheck === '') {
      this.showMessage('warn', 'endTime can not be empty');
      return;
    }
    if (this.queryImsiForCheck === '') {
      this.showMessage('warn', 'imsi can not be empty');
      return;
    }

    if (!/^[0-9]*$/.test(this.queryImsiForCheck)) {
      this.showMessage('warn', 'imsi must be number');
      return;
  }
    this.item = {startTime: (this.queryStartTimeForCheck ? moment(this.queryStartTimeForCheck).format('YYYY-MM-DD HH:mm:ss') : ''), endTime: (this.queryEndTimeForCheck ? moment(this.queryEndTimeForCheck).format('YYYY-MM-DD HH:mm:ss') : ''), imsi: this.queryImsiForCheck, userName: this.userMessage};
    this.signalingService.signalingCheck(this.item).subscribe(
      result => {
        this.checkResult = result;
        if (result.executeCmd === 'true') {
          this.time = window.clearInterval(this.time);
          this.sendTime();
          this.showMessage('success', 'Command has been executed');
        }else {
          // this.sendTime();
          // this.showMessage('success', 'Command has been executed');
          this.showMessage('error', result.errorInfo);
        }
      }
    );
    this.resetQueryParam();
  }

  getConfig() {
    this.signalingConfigDisplay = true;
    this.getDownLoadPeriodLimit();
}

editConfig() {
  if (!this.configEntity['tracebackPeriod']) {
    this.showMessage('warn', 'tracebackPeriod can not be empty');
    return;
  }
  if (!this.configEntity['downloadPeriod']) {
    this.showMessage('warn', 'downloadPeriod can not be empty');
    return;
      }
  this.signalingService.saveConfig(this.configEntity).subscribe(
    result => {
      this.signalingConfigDisplay = false;
      this.showMessage('success', 'Save success');
    }
  );
}

getDownLoadPeriodLimit() {
  this.signalingService.getConfig().subscribe(
    result => {
        this.configEntity = result;
    }
  );
}

downLoad(item) {
  this.item = {requestTime: item['requestTime'], filePath: item['filePath'], downloadPeriodLimit: this.configEntity['downloadPeriod']};
  this.signalingService.dateCompareDownload(this.item).subscribe(
      result => {
       this.comprarDownLoadLimitResult = result['compareDateResult'];
       if (this.comprarDownLoadLimitResult === 'false') {
          this.showMessage('warn', 'file has passed the effective time');
          return;
       }else {
        this.signalingService.downLoadData(this.item);
       }
      });
}

resetQueryParam() {
  this.queryStartTimeForCheck = '';
  this.queryEndTimeForCheck = '';
  this.queryUserName = '';
  this.queryImsiForCheck = '';
  this.queryStartTime = '';
  this.queryEndTime = '';
  this.queryImsi = '';
}


  showMessage(type, detail) {
    this.msgs = [];
    this.msgs.push({severity: type, summary: 'message', detail: detail});
  }

}
