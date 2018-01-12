import { Component, OnInit } from '@angular/core';
import { MenuItem, ConfirmationService} from 'primeng/primeng';
import { ReportCommonService, StatVo } from '../report-common.service';
import {ReportAccessService, ManualOptionVo, HistoryVo, PageHistory, SendMsgsInfo, PageableVo } from './report-access.service';
import { Http, Headers, URLSearchParams, Response, RequestOptions } from '@angular/http';
import {
  ReportMailService, MailGroupVo, MailUserPo,
  MailUserGroupIdVo, PageGroup, MailInterfaceInfo
} from '../report-email/report-email.service';
import * as moment from 'moment';

@Component({
  selector: 'ices-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [ReportCommonService, ConfirmationService]
})
export class ReportComponent implements OnInit {

  constructor(private reportCommonService: ReportCommonService,
              private confirmationService: ConfirmationService,
              private reportAccessService: ReportAccessService) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.STAT_ENDPOINT = apiConfig['reportURL'];
  }

  globalUrl = {};
  STAT_ENDPOINT = '';

  stateLabel = ['Processing', 'Completed', 'UserInterrupt'];
  states = [
      { label : 'All Status', value : ''},
      { label : 'Processing', value : '0'},
      { label : 'Completed', value : '1'},
      { label : 'UserInterrupt', value : '2'}
  ];

  selectedState  = '';

  types = [
      { label : 'All Type',value : ''},
      { label : 'Daily Report',value : 'daily'},
      { label : 'Weekly Report',value : 'weekly'}
  ];

  selectedType = '';

  dataList = [];

  totalRecords = 0;

  page :number = 0;

  size :number = 0;

  pageableVo : PageableVo = {};

  pageHistory :PageHistory = {};

  msgs = [];

  emailDisplay : boolean = false;

  reportId : string;

  groups = [
      // { name :'维护组'  }
  ];

  mailUserGroupIdVo : MailUserGroupIdVo = {};

  selectedGroup = [];

  selectedUser = [];

  tmpSelectedUser = [];

  sendMsgsInfo : SendMsgsInfo = {};

  statVo:StatVo = {};

  showInfo(type,title,content) {
        this.msgs = [];
        this.msgs.push({severity:type, summary:title, detail:content});
  }

  ngOnInit() {
    this.loadGroups();
    this.loadMainInterFace();
  }

  loadGroups(){
    console.log('start loadGroups...');
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/groupusers/survey',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.groups = result;
        });
  }

  mailInterfaceInfo : MailInterfaceInfo = {};
  //短信发送接口属性
  messageSendInterface:string;
  messageContent:string;
  messageSendId:string;

  loadMainInterFace(){
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/mail/mailinterface/view')
        .subscribe(result => {
          this.mailInterfaceInfo = result;
          this.messageSendInterface = this.mailInterfaceInfo.commandPath;
          console.log(1);
          console.log(this.messageSendInterface);
          console.log(2);
          if(this.mailInterfaceInfo.id!=null){
            this.messageSendId = this.mailInterfaceInfo.id.toString();
          }
        });
  }

  removeItem(item){
      this.confirmationService.confirm({
          message : 'delete ？ ',
          accept : ()=>{
            const delParams = new URLSearchParams();
            console.log('item.srId:'+item.srId);
            delParams.append('rid', item.srId);
            this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/report/schedule/delete',delParams)
              .subscribe(result => {
                this.dataList.splice(this.dataList.indexOf(item),1);
                this.showInfo('success','delete','delete success！');
                this.loadHistoryList(this.page,this.size);
              });
          }
      })
  }

  downItem(data){
    window.open(this.STAT_ENDPOINT + data.zipFilePath);
  }

  stopItem(data){
      this.confirmationService.confirm({
          message : 'stop ？ ',
          accept : ()=>{
            const delParams = new URLSearchParams();
            console.log('data.srId:'+data.srId);
            delParams.append('srId', data.srId);
            this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/report/generate/schedule/stop',delParams)
              .subscribe(result => {
                data.execStatus = '2';
                this.showInfo('success','stop','stop success！');
              });


          }
      })
  }

  emailSend(data){
    console.log('data.srId:'+data.srId);
      this.reportId = data.srId;
      this.emailDisplay = true;
  }

  loadCarsLazy(event){
      // this.dataList = [
      //   { createDate : new Date(),name:'201704181544-JiangXiMcc_All_Network_Status_Report_ALL-daily',state:'0' }
      // ];
      this.page = event.first/event.rows + 1;
      this.size = event.rows;
      this.loadHistoryList(this.page,this.size);
  }

  loadHistoryList(page,size){
    this.pageableVo.page = page;
    this.pageableVo.pageSize = size;

    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/report/generate/schedule/history',this.pageableVo)
        .subscribe(result => {
          this.pageHistory = result;
          this.dataList = this.pageHistory.dataList;
          this.totalRecords = this.pageHistory.totalRecords;
        });
  }

  queryHistoryList(){
    this.pageableVo.page = this.page;
    this.pageableVo.pageSize = this.size;

    if(this.pageableVo.startTime!=undefined){
      console.log('time is not undefined');
      this.pageableVo.startTime = moment(this.pageableVo.startTime).format('YYYY-MM-DD HH:mm');
    }
    if(this.pageableVo.endTime!=undefined){
      this.pageableVo.endTime = moment(this.pageableVo.endTime).format('YYYY-MM-DD HH:mm');
    }

    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/report/generate/schedule/history',this.pageableVo)
        .subscribe(result => {
          this.pageHistory = result;
          this.dataList = this.pageHistory.dataList;
          this.totalRecords = this.pageHistory.totalRecords;
        });
  }

  resetQueryConditions(){
    this.pageableVo = {};
    this.queryHistoryList();
  }

  onGroupSelected(event){
    event.data.mailUserPos.forEach(element => {
      let hasUser = false;
      this.selectedUser.forEach(user => {
        if ( element.userId == user.userId ) {
          hasUser = true;
        }
      });
      if (!hasUser){
        this.selectedUser.push(element);
      }
    });

    console.log(this.selectedUser);
  }

  onGroupUnSelected(event){
    event.data.mailUserPos.forEach(element => {
      let hasUser = false;
      this.selectedUser.forEach(user => {
        if ( element.userId == user.userId ) {
          hasUser = true;
        }
      });
      if (hasUser){
        this.selectedUser.splice(this.selectedUser.indexOf(element), 1);
      }
    });
    console.log(this.selectedUser);
  }

  onUserSelected(event){
    this.selectedUser.forEach(user => {
      this.tmpSelectedUser.push(user);
    });
    this.tmpSelectedUser.push(event.data);
    this.groups.forEach(group => {
      let hasEveyUser = true;
      group.mailUserPos.forEach(user => {
        let hasaUser = false;
        this.tmpSelectedUser.forEach(suser => {
          if ( user.userId == suser.userId ) {
            hasaUser = true;
          }
          else{
          }
        });
        if (hasaUser == false){
          hasEveyUser = false;
        }
      });
      if ( hasEveyUser ) {
        let hasGroup = false;
        this.selectedGroup.forEach(sgroup => {
          if ( group.gid == sgroup.gid ) {
            hasGroup = true;
          }
        });
        if ( !hasGroup ) {
          this.selectedGroup.push(group);
        }

      }
    });
    this.tmpSelectedUser = [];
  }
  onUserUnSelected(event){
    this.selectedUser.forEach(user => {
      this.tmpSelectedUser.push(user);
    });
    this.tmpSelectedUser.splice(event.data, 1);
    console.log(this.tmpSelectedUser.length);
    this.groups.forEach(group => {
      let hasNoUser = true;
      group.mailUserPos.forEach(user => {
        let hasaUser = false;
        this.tmpSelectedUser.forEach(suser => {
          if ( user.userId == suser.userId ) {
            hasaUser = true;
          }
        });
        if ( hasaUser ) {
          hasNoUser = false;
        }
      });
      if ( hasNoUser ){
        let hasGroup = false;
        this.selectedGroup.forEach(sgroup => {
          if ( group.gid == sgroup.gid ) {
            hasGroup = true;
          }
        });
        if ( hasGroup ) {
          this.selectedGroup.splice(this.selectedGroup.indexOf(group), 1);
        }

      }
    });
    this.tmpSelectedUser = [];
  }

  sendMsg(){
    this.sendMsgsInfo.manualReportId = this.reportId;
    this.sendMsgsInfo.mailUserPos = this.selectedUser;
    console.log('send msg...');
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/interval/mail/resend',this.sendMsgsInfo)
        .subscribe(result => {
          this.statVo = result;
          console.log('this.statVo.stat:'+this.statVo.stat);
          if(this.statVo.stat=='success'){
            this.showInfo('success','send','send success');
          }
          if(this.statVo.stat=='nointerface'){
            this.showInfo('no mail interface','send','no mail interface');
          }
        });
  }

}
