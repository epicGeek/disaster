import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { BossMonitorService } from './boss-monitor.service';
@Component({
  selector: 'ices-boss-monitor',
  templateUrl: './boss-monitor.component.html',
  // styleUrls: ['./boss-monitor.component.css'],
  styles: ['.ui-paginator-last {  pointer-events: none; color: gray; }'],
  providers: [BossMonitorService]
})
export class BossMonitorComponent implements OnInit {
  zh_CN = {};
  en_US = {};
  bossDataTable = [];
  hlrsns: SelectItem[];
  operationNames: SelectItem[];
  errorCodes: SelectItem[];
  resultTypes: SelectItem[];
  startDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 7));
  endDate = new Date();
  hlrsnSelected: String;
  operationNameSelected: String;
  errorCodeSelected: String;
  resultTypeSelected: String;
  numberString: String;
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  display: Boolean = false;
  soapLog: String = '';
  errLog: String = '';

  msgs = [];
  constructor(private bossMonitorService: BossMonitorService) { }

  ngOnInit() {
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
    this.pageSize = 20;
    this.pageNumber = 0;
    this.getHlrsnDropdown();
    this.getCommandDropdown();
    this.getErrorCodeDropdown();
    this.getResultTypeDropdown();
  }

  getResultTypeDropdown() {
    this.resultTypes = [];
    this.resultTypes.push({label: 'All types', value: null});
    this.resultTypes.push({label: 'Success', value: 'success'});
    this.resultTypes.push({label: 'Failure', value: 'failure'});
  }
  getHlrsnDropdown() {
    this.bossMonitorService.getHlrsnDropDown().subscribe(
      result => {
        this.hlrsns = [];
        this.hlrsns.push({ label: 'HLRSN', value: null });
        result.forEach(element => {
          this.hlrsns.push({ label: element, value: element });
        });
      }
    );
  }
  getCommandDropdown() {
    this.bossMonitorService.getCommandDropDown().subscribe(
      result => {
        this.operationNames = [];
        this.operationNames.push({ label: 'Commands', value: null });
        result.forEach(element => {
          this.operationNames.push({ label: element, value: element });
        });
      }
    );
  }
  getErrorCodeDropdown() {

    this.bossMonitorService.getErrorCodeDropdown().subscribe(
      result => {
        this.errorCodes = [];
        this.errorCodes.push({ label: 'Error codes', value: null });
        result.forEach(element => {
          this.errorCodes.push({ label: element['error_code_desc'], value: element['error_code'] });
        });
      }
    );
  }
  export() {
    // 导出
    const searchParams = {
      // userNumber: this.userNumber,
      numberString: this.numberString,
      startDate: this.startDate,
      endDate: this.endDate,
      hlrsn: this.hlrsnSelected,
      resultType: this.resultTypeSelected,
      operationName: this.operationNameSelected,
      errorCode: this.errorCodeSelected
    };
    this.bossMonitorService.exportData(searchParams);
  }
  query() {
    this.getBossDataTable({
      first: 0,
      rows: this.pageSize
    });
  }
  getBossDataTable(event) {
    // 查询数据
    const searchParams = {
      // userNumber: this.userNumber,
      numberString: this.numberString,
      startDate: this.startDate,
      endDate: this.endDate,
      hlrsn: this.hlrsnSelected,
      resultType: this.resultTypeSelected,
      operationName: this.operationNameSelected,
      errorCode: this.errorCodeSelected,
      pageNumber: event.first / event.rows,
      pageSize: event.rows
    };
    console.log(searchParams);
    this.bossMonitorService.getBossDataByCondition(searchParams).subscribe(
      result => {
        this.bossDataTable = result['hits'];
        this.totalRecords = result['total'];
      }
    );
  }
  showDialog() {
    // 弹出框：显示日志详情
    this.display = true;
  }
  queryRowBtn(bossLogData) {
    // 查询这条TASK_ID的日志
    this.soapLog = bossLogData.soap_log;
    this.errLog = bossLogData.error_log;
  }

}
