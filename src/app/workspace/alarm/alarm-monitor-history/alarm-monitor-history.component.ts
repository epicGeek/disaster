import { Component, OnInit } from '@angular/core';
import { AlarmMonitorHistoryService, AlarmReceiveHistory } from './alarm-monitor-history.service';

@Component({
  selector: 'ices-alarm-monitor-history',
  templateUrl: './alarm-monitor-history.component.html',
  styleUrls: ['./alarm-monitor-history.component.css']
})
export class AlarmMonitorHistoryComponent implements OnInit {

  constructor(private alarmMonitorHistoryService: AlarmMonitorHistoryService) { }

  unitArray = [];
  ngOnInit() {

    // 加载unitName下拉框数据
    this.getUnitNameList();

 }
 msgs = [];

  alarmLevelArray = [ { label : 'ALL LEVEL', value : '' },
                      { label : '*', value : '*' },
                      { label : '**', value : '**' },
                      { label : '***', value : '***' } ];

historyAlarmList :AlarmReceiveHistory[] =[];

totalRecords :number=0;

alarmHistory: AlarmReceiveHistory = {};

 alarmDescDisplay : boolean = false;

  page : number = 0;
  size : number = 0;

loadAlarmHistoryLazy(event) {
  this.page = event.first / event.rows;
  this.size = event.rows;
  this.getData();
}

getData() {
  this.alarmHistory.page = this.page;
  this.alarmHistory.size = this.size;
  this.alarmMonitorHistoryService.getAlarmReceiveHistory(this.alarmHistory)
  .subscribe(alarmHistoryData =>{
    this.historyAlarmList = alarmHistoryData['content'];
    this.totalRecords = alarmHistoryData['totalElements']; 
  });
}

exportData(){
    this.alarmMonitorHistoryService.exportAlarmReceiveHistory(this.alarmHistory)
    .subscribe(alarmHistoryData =>{
        console.log(alarmHistoryData);
    });
}

alarmDescStr = '';
//获取告警描述
alarmDesc(item){
  // let SupplInfo:string = item.supplInfo;
  this.alarmDescDisplay = true;
  this.alarmDescStr = 'Suppl Info :\n\n';
  this.alarmDescStr += '\r'+(item.supplInfo ? item.supplInfo.replace('Suppl Info','') : '') + '\n\n\n\n' ;
  this.alarmDescStr += 'alarmDesc:\n\n\r';
    this.alarmMonitorHistoryService.getAlarmDesc(item)
    .subscribe( result => {
        this.alarmDescStr += (result.length == 0 ? '' : result['_embedded']['alarm-rule'][0].alarmDesc);
    });
}



  // 获取unitName
  getUnitNameList() {
    this.alarmMonitorHistoryService.getUnitNameList()
    .subscribe( result => {
        this.unitArray = [];
        this.unitArray.push({ label : 'ALL UNIT' , value : null});
        result.forEach( element => {
          this.unitArray.push({ label : element['unitName'] , value : element['unitName']});
        });
     } , error => {});
  }

  // 重置
  resetParam() {
    this.alarmHistory = {};
    this.getData();
  }




}
