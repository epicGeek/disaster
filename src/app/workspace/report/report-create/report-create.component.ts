import { Component, OnInit } from '@angular/core';
import { ReportCreateService, ManualOptionVo, ProcessPo, PageHistory, SendMsgsInfo } from './report-create.service';
import { MenuItem, ConfirmationService} from 'primeng/primeng';
import { ReportCommonService, StatVo } from '../report-common.service';
import {
  ReportMailService, MailGroupVo, MailUserPo,
  MailUserGroupIdVo, PageGroup, MailInterfaceInfo
} from '../report-email/report-email.service';
import { Http, Headers, URLSearchParams, Response,RequestOptions } from '@angular/http';
import * as moment from 'moment';
import { AuthService} from '../../../auth/auth.service';
@Component({
  selector: 'ices-report-create',
  templateUrl: './report-create.component.html',
  styleUrls: ['./report-create.component.css'],
  providers: [ReportCommonService, ConfirmationService]
})
export class ReportCreateComponent implements OnInit {

  constructor(private reportCommonService: ReportCommonService,
              private reportCreateService:ReportCreateService,
              private confirmationService:ConfirmationService,private authService:AuthService) {

    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.STAT_ENDPOINT = apiConfig['reportURL'];
  }
  globalUrl = {};
  STAT_ENDPOINT = '';
  mailInterfaceInfo : MailInterfaceInfo = {};
  //短信发送接口属性
  messageSendInterface:string;
  messageContent:string;
  messageSendId:string;

  ngOnInit() {
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/templet/dhsstemplets/options')
        .subscribe(result => {
          this.checkBoxData = result;
        });
    this.loadGroups();
    this.loadMainInterFace();
  }

  loadMainInterFace(){
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/mail/mailinterface/view')
        .subscribe(result => {
          this.mailInterfaceInfo = result;
          this.messageSendInterface = this.mailInterfaceInfo.commandPath;
          if(this.mailInterfaceInfo.id!=null){
            this.messageSendId = this.mailInterfaceInfo.id.toString();
          }
        });
  }

  loadGroups(){
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/groupusers/survey',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.groups = result;
        });
  }

  mailUserGroupIdVo : MailUserGroupIdVo = {};

  sendMsgsInfo : SendMsgsInfo = {};

  dataList = [];

  totalRecords = 0;

  page :number = 0;

  size :number = 0;

  tabOneSelected :boolean=true;

  tabTwoSelected :boolean=false;

  pageHistory :PageHistory = {};

  selectedContent = [];

  startTime = new Date();

  endTime = new Date();

  statVo:StatVo = {};

  manualOptionVo : ManualOptionVo = {};

  statKey:string = Math.random() * 1234567 + '';

  checkBoxData = [
      // { label :'JiangXiMcc_All_Network_Status_Report_ALL_old' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_ALL' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_MME' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_SAEGW' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_summary' , value :'' }
  ];

  selectedTemp = {};

  selectedKz = [];

  playDisbled : boolean = false;

  stopDisbled : boolean = true;

  processPo : ProcessPo = {};

  msgs = [];

  stepIndex = 1;

  isEnd = "N";

  logInfoList = [
       { label :'' }
  ];

  emailDisplay : boolean = false;

  reportId : string;

  selectedGroup = [];

  selectedUser = [];

  tmpSelectedUser = [];

  groups = [
      // { gid:1,groupName :'维护组' ,mailUserPos:[{userId:1,userName:'xiaozhao',email:'1@1.com',phone:'13111111111'},
      //                                 {userId:2,userName:'xiaoqian',email:'2@1.com',phone:'13211111111'}] },
      // { gid:2,groupName :'测试组' ,mailUserPos:[{userId:3,userName:'xiaosun',email:'3@1.com',phone:'13311111111'},
      //                                 {userId:4,userName:'xiaoli',email:'4@1.com',phone:'13311111111'}
      // ] }
  ];


  loadCarsLazy(event){
      this.dataList = [
          //  { execTime : new Date() , person:'admin',desc:'' },
          //  { execTime : new Date() , person:'admin',desc:'' },
          //  { execTime : new Date() , person:'admin',desc:'' },
          //  { execTime : new Date() , person:'admin',desc:'' },
          //  { execTime : new Date() , person:'admin',desc:'' }
      ];
      this.page = event.first/event.rows + 1;
      this.size = event.rows;
      this.loadHistoryList(this.page,this.size);
  }

  loadHistoryList(page, size){
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/report/dhssgenerate/manul/history?page='+page+'&size='+size)
        .subscribe(result => {
          this.pageHistory = result;
          this.dataList = this.pageHistory.dataList;
          this.totalRecords = this.pageHistory.totalRecords;
        });
  }

  getStatus(){
    console.log('this.statKey:'+this.statKey);
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/report/generate/manul/status?statKey='+this.statKey)
        .subscribe((result) => {
          this.processPo = result;
          this.setStatus(this.processPo.transCurObj, this.processPo.transCurNum, this.processPo.transIsEnd);
          if ( this.isEnd=="N" ) {
            setTimeout(this.getStatus(), 1000);
          }
          else{
            this.initIsEnd();
          }
        });
  }

  initIsEnd(){
  //	isEnd = "N";
    this.stepIndex = 1;
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/report/generate/manul/status/init?statKey='+this.statKey)
        .subscribe((result) => {

        });

  }

  hadLogContent(content){
    let had = false;
    this.logInfoList.forEach(log => {
      if(log.label.indexOf(content) != -1){
        had = true;
      }
    });
    return had;
  }

  setStatus(task, tastIdenty, end){
    if ( end=="Y" ) {
      this.isEnd = "Y";
    }else{
      this.isEnd = "N";
    }
    if(!this.isNullOrEmpty(task)){
      if (!this.hadLogContent(tastIdenty)){
        let isinull = this.isNullOrEmpty(tastIdenty);
        let istnull = this.isNullOrEmpty(task);
        let showTask = "step" + this.stepIndex + "：" + task; // + "tastIdenty:" + tastIdenty + ",isinull:" + isinull + ",istnull"+istnull
        let newlog = { label : showTask };
        this.logInfoList.push(newlog);
        this.stepIndex++;
      }
    }
  }

  isNullOrEmpty(strVal) {
    if (strVal == '' || strVal == null || strVal == undefined) {
      return true;
    } else {
      return false;
    }
  }

  play(createTabView){
      // this.playDisbled = true;
      // this.stopDisbled = false;
      this.selectedContent.forEach(val => {
        if ( val == 'hasgs'){
          this.manualOptionVo.hasgs = '1';
        }
        else if (val == 'gsexcel'){
          this.manualOptionVo.gsexcel = '1';
        }
        else if (val == 'hashs'){
          this.manualOptionVo.hashs = '1';
        }
      });
      if ( this.manualOptionVo.templetId != undefined ){
        if (this.manualOptionVo.startTime != undefined && this.manualOptionVo.startTime != '' && this.manualOptionVo.endTime != undefined && this.manualOptionVo.endTime != ''){
          this.logInfoList = [];
          this.manualOptionVo.startTime = moment(this.manualOptionVo.startTime).format('YYYY-MM-DD HH:mm');
          this.manualOptionVo.endTime = moment(this.manualOptionVo.endTime).format('YYYY-MM-DD HH:mm');
          this.manualOptionVo.sessionId = this.statKey;
           this.authService.appendLogWithContent('/workspace/report/create', 'reportCreate', 'exec :' +JSON.stringify(this.manualOptionVo)).subscribe(result => {}, error => { });
          this.getStatus();
          this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/report/generate/manul', this.manualOptionVo)
            .subscribe(result => {
              this.loadHistoryList(this.page, this.size);
              this.manualOptionVo = {};
              this.selectedContent = [];
              this.playDisbled = false;
              this.stopDisbled = true;
              createTabView.tabs[0].selected = false;
              createTabView.tabs[1].selected = true;
            });
        }
        else{
          this.showInfo('fail', 'pick time first');
        }
      }
      else{
        this.showInfo('fail', 'select template first');
      }
  }

  stop(){
      this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/report/generate/manul/status/stop?statKey='+this.statKey)
        .subscribe((result) => {
          this.playDisbled = false;
          this.stopDisbled = true;
        });

  }

  yinyong(data, createTabView, cttGs, cttGsexcel, cttHs){
    console.log(createTabView);
    createTabView.tabs[0].selected = true;
    createTabView.tabs[1].selected = false;
    console.log('data.startTime:'+data.startTime);
    this.manualOptionVo.startTime = data.startTime;
    this.manualOptionVo.endTime = data.endTime;
    if (data.hasgs=='1'){
      console.log('data.hasgs:'+data.hasgs);
      this.selectedContent.push('hasgs');
      cttGs.checked = true;
    }

    if (data.gsexcel=='1'){
      console.log('data.gsexcel:'+data.gsexcel);
      this.selectedContent.push('gsexcel');
      cttGsexcel.checked = true;
    }

    if (data.hashs=='1'){
      this.selectedContent.push('hashs');
      cttHs.checked = true;
    }

    this.manualOptionVo.templetId = data.templetId;
    this.manualOptionVo.comments = data.desc;
  }

  removeItem(data){
    this.confirmationService.confirm({
        message: 'delete',
        accept : () => {
            const delParams = new URLSearchParams();
            delParams.append('mrId', data.mrId);

            this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/report/generate/manul/status/delete', delParams)
              .subscribe(result => {
                // if(result.indexOf('html>')!=-1){
                //   localStorage.setItem('serviceTicket',null);
                //   this.router.navigate(['/login']);
                // }
                this.statVo = result;
                if (this.statVo.stat=='success'){
                  this.loadHistoryList(this.page, this.size);
                  this.dataList.splice(this.dataList.indexOf(data), 1);
                  this.showInfo('success', 'delete success');
                  this.authService.appendLogWithContent('/workspace/report/create', 'reportCreate', 'remove result :' +JSON.stringify(data)).subscribe(result => {}, error => { });
                }
                else{
                  this.showInfo('fail', 'delete fail');
                }
              });
        }
    });
  }

  showInfo(type, message) {
        this.msgs = [];
        this.msgs.push({severity: type, summary: 'Message', detail: message});
  }

  emailSend(data){
      this.reportId = data.mrId;
      this.emailDisplay = true;
      console.log('chekck groups begin:');
      this.selectedGroup.forEach(group => {
        console.log(group.groupName);
      });
      console.log('check groups end;');
  }

  downItem(data){
    window.open(this.STAT_ENDPOINT + data.zipFilePath);
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
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/report/manual/mail/send', this.sendMsgsInfo)
        .subscribe(result => {
          this.statVo = result;
          console.log('this.statVo.stat:'+this.statVo.stat);
          if ( this.statVo.stat=='success' ) {
            this.showInfo('success', 'send success');
          }
          if ( this.statVo.stat=='nointerface' ) {
            this.showInfo('no mail interface', 'no mail interface');
          }
        });
  }
}
