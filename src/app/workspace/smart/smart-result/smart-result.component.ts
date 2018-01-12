import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SmartResultService } from './smart-result.service';

@Component({
  selector: 'ices-smart-result',
  templateUrl: './smart-result.component.html',
  styleUrls: ['./smart-result.component.css']
})
export class SmartResultComponent implements OnInit {

  constructor(private smartResultService: SmartResultService, private router: Router) { }

  zh_CN = {};
  en_US = {};
  //页面提示信息
  msgs = [];

  //当前页数
  page: number;

  //每页条数
  size: number;

  //开始时间
  startDate: Date = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 53));

  //结束时间
  endDate: Date = new Date();

  //任务名称
  jobName: string = '';

  //总条数
  totalSize = 0;

  //列表数据
  resultList = [];

  //选中的任务
  checkedJob = [];

  exception() {
    let temp = { pageType: 'execption', code: '0' };
    this.router.navigate(['/workspace/smart/result/detail', temp]);
  }


  LazyLoad(event) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.getResultList();
  }

  //全部选中或者全部取消
  selectJob(event, dt) {
    this.checkedJob = [];
    let temp: any[] = dt.dataToRender;
    if (event) {
      temp.forEach(element => {
        this.checkedJob.push(element.entityId);
      });
    }
  }

  //选择任务下载日志
  chkDown() {
    if (this.checkedJob.length == 0) {
      this.showInfo("warn", "message", "selected item");
    } else {
      let temp: string = "";
      this.checkedJob.forEach(element => {
        temp += temp ? (',' + element) : element;
      });
      this.smartResultService.jobResultLogDown(temp);
    }
  }

  //按任务查看
  job(item) {
    this.router.navigate(['/workspace/smart/result/filter', { id: item.entityId, name: 'job' }]);
  }

  //按任务查看
  ne(item) {
    this.router.navigate(['/workspace/smart/result/filter', { id: item.entityId, name: 'ne' }]);
  }

  //按任务下载日志
  jobDownloadLog(item) {
    this.smartResultService.jobResultLogDown(item.entityId);
  }

  reset() {
    this.startDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 53));
    this.endDate = new Date();
    this.jobName = '';
    this.getResultList();
  }

  //获取分页数据
  getResultList() {
    let this_startDate = moment(new Date(this.startDate)).format('YYYY-MM-DD HH:mm:ss');
    let this_endDate = moment(this.endDate).format('YYYY-MM-DD HH:mm:ss');
    this.smartResultService.getSmartCheckResultList(this_startDate, this_endDate, this.jobName, this.page, this.size).subscribe(result => {
      this.totalSize = result['page']['totalElements'];
      this.resultList = result['_embedded']['smart-check-schedule-result'] || {};
    });
  }


  ngOnInit() {
    this.zh_CN = {
      dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
      monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    };
    this.en_US = {
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
      dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "June.", "July.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
    }
  }

  //信息提示
  showInfo(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }

}