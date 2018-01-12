import { Component, OnInit } from '@angular/core';
import { AlarmMonitorCustomService, AlarmMonitor } from './alarm-monitor-custom.service';
import { CheckboxModule, SelectItem } from 'primeng/primeng';
import * as moment from 'moment';
@Component({
  selector: 'ices-alarm-monitor-custom',
  templateUrl: './alarm-monitor-custom.component.html',
  styleUrls: ['./alarm-monitor-custom.component.css']
})
export class AlarmMonitorCustomComponent implements OnInit {

  constructor(private alarmMonitorCustomService: AlarmMonitorCustomService) {
    this.mailNotice.push({ label: "YES", value: "YES" });
    this.mailNotice.push({ label: "NO", value: "NO" });
    this.shortTextNotice.push({ label: "YES", value: "YES" });
    this.shortTextNotice.push({ label: "NO", value: "NO" });
    this.alarmMonitor.startTime = moment(new Date().getTime() - (1000 * 60 * 60 * 24 * 30)).format('YYYY-MM-DD HH:mm:ss');
    this.alarmMonitor.endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  }

  configAlarmGroupDisplay: boolean = false;

  alarmMemberDisplay: boolean = false;

  addAlarmGroupDisplay: boolean = false;

  addAlarmMemberDisplay: boolean = false;

  unitArray = [];


  mailNotice: SelectItem[] = [];
  mailNoticeSelected: string;
  shortTextNotice: SelectItem[] = [];
  shortTextNoticeSelected: string;

  ngOnInit() {
    // 加载unitName下拉框数据
   // this.getUnitNameList();
    this.getUnits();

  }


  alarmTypeArray = [{ label: 'All Types', value: '' },
  { label: 'KPI', value: 'KPI' },
  { label: 'Healthy check', value: 'Healthy check' }

  ];

  monitorAlarmList: AlarmMonitor[] = [];

  totalRecords: number = 0;

  alarmMonitor: AlarmMonitor = {};

  page: number = 0;
  size: number = 0;

  loadAlarmMonitorLazy(event) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.getData();
  }

  getData() {
    this.alarmMonitor.page = this.page;
    this.alarmMonitor.size = this.size;
    this.alarmMonitorCustomService.getAlarmMonitor(this.alarmMonitor)
      .subscribe(alarmMonitorData => {
        this.monitorAlarmList = alarmMonitorData['content'];
        this.totalRecords = alarmMonitorData['totalElements'];
      });
  }


  // 获取unitName,不加权限控制
  // getUnitNameList() {
  //   this.alarmMonitorCustomService.getUnitNameList()
  //     .subscribe(result => {
  //       console.log("origin units");
  //       console.log(result);
  //       this.unitArray = [];
  //       this.unitArray.push({ label: 'All Units', value: '' });
  //       result.forEach(element => {
  //         this.unitArray.push({ label: element['unitName'], value: element['unitName'] });

  //       });
  //     }, error => { });
  // }
  //增加权限控制过滤后的单元
  getUnits() {
    this.alarmMonitorCustomService.getUnits().subscribe(
      result => {
        console.log("target units");
        console.log(result['unit']);
        this.unitArray = [];
        this.unitArray.push({ label: 'All Units', value: '' });
        result['unit'].forEach(element => {
          this.unitArray.push({ label: element['label'], value: element['value'] });

        });
      }
    )
  }

  // 重置
  resetParam() {
    this.alarmMonitor = {};
    this.getData();
  }


  alarmGroupList = [];
  alarmMemberList = [];
  configAlarmGroup() {
    this.configAlarmGroupDisplay = true;
    this.getAlarmGroup();
  }

  getAlarmGroup() {
    this.alarmMonitorCustomService.getAlarmGroup().subscribe(
      result => {
        this.alarmGroupList = result;
      }
    );
  }
  getAlarmMember() {
    this.alarmMonitorCustomService.getAlarmMember().subscribe(
      result => {
        this.alarmMemberList = result;
      });
  }

  alarmGroupNameInDialog: string = '';
  alarmGroupDescInDialog: string = '';
  addAlarmGroup() {
    this.addAlarmGroupDisplay = true;
    this.alarmGroupNameInDialog = "";
    this.alarmGroupDescInDialog = "";
    this.isAddGroup = true;
  }
  saveGroup() {

    if (this.alarmGroupNameInDialog == "") {
      alert("Alarm name cannot be empty!");
    } else {
      if (this.isAddGroup) {
        this.alarmMonitorCustomService.addGroup(this.alarmGroupNameInDialog, this.alarmGroupDescInDialog).subscribe(
          resultData => {
            this.getAlarmGroup();
            this.addAlarmGroupDisplay = false;
          }
        );

      } else {

        this.alarmMonitorCustomService.editGroup(this.editAlarmGroupUrl, this.alarmGroupNameInDialog, this.alarmGroupDescInDialog).subscribe(
          resultData => {
            this.getAlarmGroup();
            this.addAlarmGroupDisplay = false;
          });

      }




    }

  }

  alarmMemberNameInDialog: string;
  alarmMemberCellPhoneNumberInDialog: string;
  alarmMemberEmailAddresssInDialog: string;
  isAddGroup: boolean;

  addMember() {
    this.isAddMember = true;
    this.addAlarmMemberDisplay = true;
    this.alarmMemberNameInDialog = "";
    this.alarmMemberCellPhoneNumberInDialog = "";
    this.alarmMemberEmailAddresssInDialog = "";

  }
  deleteGroup(alarmGroup) {

    this.alarmMonitorCustomService.deleteByUrl(alarmGroup).subscribe(
      resultData => {
        this.getAlarmGroup();
      }
    );
  }
  editMemberUrl: string;
  saveMember() {
    if (this.alarmMemberNameInDialog == "" || this.alarmMemberCellPhoneNumberInDialog == "" || this.alarmMemberEmailAddresssInDialog == "") {
      alert("Member name,cell phone number or email address cannot be empty!");
    } else {
      if (this.isAddMember) {
        this.alarmMonitorCustomService.addMember(this.alarmMemberNameInDialog, this.alarmMemberCellPhoneNumberInDialog, this.alarmMemberEmailAddresssInDialog, this.shortTextNoticeSelected, this.mailNoticeSelected).subscribe(
          resultData => {
            this.getAlarmMember();
            this.addAlarmMemberDisplay = false;
          }
        );
      } else {
        this.alarmMonitorCustomService.editMember(this.editMemberUrl, this.alarmMemberNameInDialog, this.alarmMemberCellPhoneNumberInDialog, this.alarmMemberEmailAddresssInDialog, this.shortTextNoticeSelected, this.mailNoticeSelected).subscribe(
          resultData => {
            this.getAlarmMember();
            this.addAlarmMemberDisplay = false;
          }
        );
      }




    }


  }
  deleteMember(alarmMemberData) {
    this.alarmMonitorCustomService.deleteByUrl(alarmMemberData).subscribe(
      resultData => {
        this.getAlarmMember();
      }
    );

  }
  isAddMember: boolean;
  configAlarmMember() {
    this.getAlarmMember();
    this.alarmMemberDisplay = true;
  }

  editAlarmMember(alarmMemberData) {

    this.editMemberUrl = alarmMemberData["_links"]["self"]["href"];
    this.addAlarmMemberDisplay = true;
    this.isAddMember = false;
    this.alarmMemberNameInDialog = alarmMemberData.memberName;
    this.alarmMemberCellPhoneNumberInDialog = alarmMemberData.cellPhoneNumber;
    this.alarmMemberEmailAddresssInDialog = alarmMemberData.emailAddress;
    this.shortTextNoticeSelected = alarmMemberData.isShortTextNotice;
    this.mailNoticeSelected = alarmMemberData.isEmailNotice;
  }
  editAlarmGroupUrl: string;
  editAlarmGroup(alarmGroup) {

    this.alarmGroupNameInDialog = alarmGroup.groupName;
    this.alarmGroupDescInDialog = alarmGroup.groupDesc;
    this.addAlarmGroupDisplay = true;
    this.isAddGroup = false;

    this.editAlarmGroupUrl = alarmGroup["_links"]["self"]["href"];

  }
}
