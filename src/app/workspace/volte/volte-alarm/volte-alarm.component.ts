import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { VolteAlarmService } from './volte-alarm.service';
@Component({
  selector: 'ices-volte-alarm',
  templateUrl: './volte-alarm.component.html',
  styleUrls: ['./volte-alarm.component.css']
})
export class VolteAlarmComponent implements OnInit {
  zh_CN = {};
  en_US = {};
  startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
  endTime = new Date();
  alarmDevices: SelectItem[];
  alarmDeviceSelected: String;
  totalRecords: Number;
  volteAlarmDataTable = [];
  constructor(private volteAlarmService: VolteAlarmService) { }

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

  query() {
    const paramMap = {
      startTime: this.startTime,
      endTime: this.endTime,
      device: this.alarmDeviceSelected
    };
    this.volteAlarmService.getVolteAlarmData(paramMap).subscribe(
      result => {
        this.volteAlarmDataTable = result;
      }
    );
  }

  getDevices() {
    this.volteAlarmService.getDevices().subscribe(
      result => {
        this.alarmDevices = result;
        this.totalRecords = result.length;
      }
    );
  }
}
