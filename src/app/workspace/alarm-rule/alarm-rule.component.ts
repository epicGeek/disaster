import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Message } from 'primeng/primeng';
import { AlarmRuleService, AlarmRule } from './alarm-rule.service';



@Component({
  selector: 'ices-alarm-rule',
  templateUrl: './alarm-rule.component.html',
  styleUrls: ['./alarm-rule.component.css']
})
export class AlarmRuleComponent implements OnInit {

  constructor(private alarmRuleService: AlarmRuleService, private authService: AuthService) {


  }

  page: number = 0;
  size: number = 0;
  totalRecords: number = 0;

  alarmRuleList = [];

  alarmRule: AlarmRule = {};

  //所有类型
  TypeList = [];

  //单元类型
  unitType = [];

  queryAlarmNo: string = '';

  queryUnitType: string;

  uploadDisplay: boolean = false;

  uploadUrl = this.alarmRuleService.getUploadUrl();


    msgs: Message[] = [];
  ngOnInit() {
    this.size = 20;
    this.initTypeList();

  }

  query() {
    this.loadAlarmRuleLazy({
      first: 0,
      rows: this.size
    });
  }

  loadAlarmRuleLazy(event) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.getAlarmRuleData();
  }

  getAlarmRuleData() {
    this.alarmRule.page = this.page;
    this.alarmRule.size = this.size;
    this.alarmRule.alarmNo = this.queryAlarmNo;
    this.alarmRule.unitType = this.queryUnitType;
    console.log(this.alarmRule);
    this.alarmRuleService.getAlarmRule(this.alarmRule)
      .subscribe(alarmRuleData => {
        this.alarmRuleList = alarmRuleData['content'];
        this.totalRecords = alarmRuleData['totalElements'];
      });
  }


  initTypeList() {
    this.alarmRuleService.getTypes().subscribe(result => {
      this.TypeList = result;
      this.unitQueryTypes();
    });
  }


  unitQueryTypes() {
    this.unitType = [];
    this.unitType.push({ label: 'ALL UNIT TYPE', value: '' });
    let unitType = {};
    this.TypeList.forEach(element => {
      this.unitType.push({ label: element['unitType'], value: element['unitType'] });
    });

  }

  filterUnitTypeQueryData() {
    this.unitQueryTypes();
  }

  resetQuery() {
    this.initTypeList();
    this.queryUnitType = '';
    this.queryAlarmNo = '';
    this.query();
  }

  exportAlarmRule() {
    this.alarmRule.alarmNo = this.queryAlarmNo;
    this.alarmRule.unitType = this.queryUnitType;
    console.log(this.alarmRule);
    this.alarmRuleService.exportAlarmRule(this.alarmRule);


  }
  importAlarmRule() {
    this.uploadDisplay = true;
  }

  afterUpload(event) {
    this.msgs = [];
    this.uploadDisplay = false;
    this.getAlarmRuleData();
    let response = JSON.parse(event.xhr.response);//json string ->json obj
    console.log(response);
    this.msgs.push({ severity: response.severity, summary: response.summary, detail: response.detail });
  }
}
