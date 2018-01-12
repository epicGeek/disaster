import { Component, OnInit } from '@angular/core';
import { PgwLogService } from './pgw-log.service';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import * as moment from 'moment';
@Component({
  selector: 'ices-pgw-log',
  templateUrl: './pgw-log.component.html',
  styleUrls: ['./pgw-log.component.css']

})
export class PgwLogComponent implements OnInit {
  pgwLogDataTable = [];
  zh_CN = {};
  en_US = {};
  userNumber: string;
  startDate: Date;
  endDate: Date;
  pgwNames: SelectItem[];
  pgwNameSelected: string;
  instanceNames: SelectItem[];
  instanceNameSelected: string;
  resultTypes: SelectItem[];
  resultTypeSelected: string;
  totalRecords: number;
  size: number;
  executionContent: string;
  dropDownListData = {};
  pageNumber: number;
  pageSize: number;
  pgwXmlLog: string;
  display: Boolean = false;
  dropdownDataCollection: any;
  pgwQueryString: string[];
  isExportLog: Boolean = false;
  exportLimit: number;
  msgs: Message[] = [];
  isSearchLog: Boolean;
  searchLogKeyWord: String;
  maxDateValue;
  constructor(private pgwLogService: PgwLogService) {

  }

  ngOnInit() {
    this.initInstanceName();
    this.initResultTypeDropdown();
    this.getDropdownData();
    this.getExportLimit();
    this.searchLogMode();
    this.getOldestDate();
    this.zh_CN = {
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    this.en_US = {
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
    };

    this.startDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
    this.endDate = new Date();
    this.pageNumber = 1;
    this.pageSize = 20;
    this.pgwNameSelected = null;
    this.resultTypeSelected = null;
    this.instanceNameSelected = null;
    this.pgwLogDataTable = [];
    this.userNumber = '';
    this.getPgwLogRecordCount();
  }



  initInstanceName() {

    this.instanceNames = [];
    this.instanceNames.push({ label: 'All Instances', value: null });
    this.instanceNames.push({ label: 'instance1', value: 'instance1' });
    this.instanceNames.push({ label: 'instance2', value: 'instance2' });
    this.instanceNames.push({ label: 'instance3', value: 'instance3' });
  }
  initResultTypeDropdown() {
    this.resultTypes = [];
    this.resultTypes.push({ label: 'All Types', value: null });
    this.resultTypes.push({ label: 'success', value: 'success' });
    this.resultTypes.push({ label: 'failure', value: 'failure' });
  }
  onChange() {
    console.log('pgw dropdown changes');
    if (this.pgwNameSelected != null) {
      const instanceNameArray: string[] = this.dropdownDataCollection[this.pgwNameSelected];
      this.instanceNames = [];
      this.instanceNames.push({ label: 'All Instances', value: null });
      instanceNameArray.forEach(element => {
        this.instanceNames.push({ label: element, value: element });
      });
    } else {
      this.initInstanceName();
    }

  }
  getDropdownData() {
    // set values for pgw names.
    this.pgwLogService.getDropdownData().subscribe(
      resultData => {
        this.dropdownDataCollection = resultData;
        this.pgwNames = [];
        this.pgwNames.push({ label: 'All PGWs', value: null });
        const pgw: string[] = Object.keys(resultData);
        pgw.forEach(element => {
          this.pgwNames.push({ label: element, value: element });
        });
      }
    );
  }

  showDialog() {
    this.display = true;
  }
  query() {
    console.log('number:' + this.pgwQueryString);
    console.log('keyword:' + this.searchLogKeyWord);
    if ((this.pgwQueryString === undefined || this.pgwQueryString.length === 0) && this.searchLogKeyWord) {
      this.msgs = [];
      this.msgs.push({
        severity: 'error',
        summary: 'Warn Message',
        detail: 'You cannot search log without any IMSI/MSISDN/Identifier !'
      });
    }else {
      this.getPgwLogDataTable({
        first: 0,
        rows: this.pageSize
      });
      this.getPgwLogRecordCount();
    }

  }
  testRowBtn(requestId) {
    this.pgwLogService.queryPgwXmlText(requestId)
      .subscribe(resultData => {
        this.pgwXmlLog = resultData['value'];
      });
  }
  getPgwLogDataTable(event) {

    const searchParams = {
      // userNumber: this.userNumber,
      pgwQueryString: this.pgwQueryString,
      startDate: this.startDate,
      endDate: this.endDate,
      pgwName: this.pgwNameSelected,
      instanceName: this.instanceNameSelected,
      resultType: this.resultTypeSelected,
      pageNumber: event.first / event.rows,
      pageSize: event.rows,
      keyword: this.searchLogKeyWord
    };
    this.pgwLogService.queryPgwLogByCondition(searchParams)
      .subscribe(resultData => {
        this.pgwLogDataTable = resultData;

      });
  }

  getPgwLogRecordCount() {

    const searchParams = {
      // userNumber: this.userNumber,
      pgwQueryString: this.pgwQueryString,
      startDate: this.startDate,
      endDate: this.endDate,
      pgwName: this.pgwNameSelected,
      instanceName: this.instanceNameSelected,
      resultType: this.resultTypeSelected,
      keyword: this.searchLogKeyWord
    };
    this.pgwLogService.queryPgwLogCountNumber(searchParams)
      .subscribe(resultData => {
        this.totalRecords = resultData;

      });
  }
  export() {

    const searchParams = {
      // userNumber: this.userNumber,
      pgwQueryString: this.pgwQueryString,
      startDate: this.startDate,
      endDate: this.endDate,
      pgwName: this.pgwNameSelected,
      instanceName: this.instanceNameSelected,
      resultType: this.resultTypeSelected,
      isExportLog: this.isExportLog,
      keyword: this.searchLogKeyWord
    };
    this.pgwLogService.queryPgwLogCountNumber(searchParams)
      .subscribe(resultData => {
        if (resultData > this.exportLimit) {
          this.msgs = [];
          this.msgs.push({
            severity: 'warn',
            summary: 'Warn Message',
            detail:
            'Export data size is:' +
            resultData +
            ',which is bigger than export limit:' +
            this.exportLimit +
            ',only ' + this.exportLimit + ' data records would be exported!'
          });
        } else {
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Export Success!' });
        }
      });
    console.log(searchParams);
    this.pgwLogService.exportPgwReport(searchParams);

  }

  getExportLimit() {
    this.pgwLogService.getExportLimit().subscribe(
      result => {
        this.exportLimit = result;
      }
    );
  }

  searchLogMode() {
    // config for whether need to search log with key word.
    this.pgwLogService.isSearchLogMode().subscribe(
      result => {
        this.isSearchLog = result;
        console.log('isSearchLog:' + this.isSearchLog);
      }
    );
  }
  getOldestDate() {
    this.pgwLogService.getOldestDate().subscribe(
      result => {
        if (result != null) {
         this.maxDateValue = moment(result).toDate();
        }else {
          this.msgs = [];
          this.msgs.push({
            severity: 'error',
            summary: 'Warn Message',
            detail: 'No PGW data available!'
          });
        }
      }
    );
  }
}
