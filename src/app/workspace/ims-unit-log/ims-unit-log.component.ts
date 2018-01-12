import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ices-ims-unit-log',
  templateUrl: './ims-unit-log.component.html',
  styleUrls: ['./ims-unit-log.component.css']
})
export class ImsUnitLogComponent implements OnInit {
  imsUnitLogData =  [];
  startDate = new Date();
  endDate = new Date();
  totalRecords = 0;
  zh_CN = {};
  en_US = {};
  constructor() {

    this.imsUnitLogData.push({fileName: 'record_cksys_20150101.log', unitName: 'soap-gw-01'});
    this.imsUnitLogData.push({fileName: 'record_cksys_20150102.log', unitName: 'soap-gw-01'});
    this.imsUnitLogData.push({fileName: 'record_cksys_20150103.log', unitName: 'soap-gw-01'});
    this.imsUnitLogData.push({fileName: 'record_cksys_20150104.log', unitName: 'soap-gw-01'});
    this.imsUnitLogData.push({fileName: 'record_cksys_20150105.log', unitName: 'soap-gw-01'});
    this.imsUnitLogData.push({fileName: 'record_cksys_20150106.log', unitName: 'soap-gw-01'});
    this.imsUnitLogData.push({fileName: 'record_cksys_20150107.log', unitName: 'soap-gw-01'});
    this.imsUnitLogData.push({fileName: 'cscf_cksys_20150107.log', unitName: 'cscf-01'});
    this.imsUnitLogData.push({fileName: 'cscf_cksys_20150107.log', unitName: 'cscf-01'});
    this.imsUnitLogData.push({fileName: 'cscf_cksys_20150107.log', unitName: 'cscf-01'});
    this.imsUnitLogData.push({fileName: 'cscf_cksys_20150107.log', unitName: 'cscf-01'});
    this.imsUnitLogData.push({fileName: 'cscf_cksys_20150107.log', unitName: 'cscf-01'});
    this.totalRecords = this.imsUnitLogData.length;
   }

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
  }

  downloadLog() {
    alert('downing this log...');
  }
  getImsUnitLogData() {
    alert('getting data...');
  }

}
