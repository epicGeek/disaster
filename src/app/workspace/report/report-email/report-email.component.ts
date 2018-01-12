import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { PanelModule} from 'primeng/primeng';
import { MenuItem, ConfirmationService} from 'primeng/primeng';
import { InputTextareaModule} from 'primeng/primeng';
import { ReportCommonService, StatVo } from '../report-common.service';
import {
  Http, Headers, URLSearchParams,
  Response, RequestOptions
} from '@angular/http';
import {
  ReportMailService, MailGroupVo, MailUserPo, MailUserGroupIdVo,
  PageGroup, MailInterfaceInfo
} from './report-email.service';
import { AuthService} from '../../../auth/auth.service';
@Component({
  selector: 'ices-report-email',
  templateUrl: './report-email.component.html',
  styleUrls: ['./report-email.component.css'],
  providers: [ReportCommonService, ConfirmationService]
})
export class ReportEmailComponent implements OnInit {

  constructor(
    private reportCommonService: ReportCommonService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
       const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
       this.STAT_ENDPOINT = apiConfig['reportURL'];
    }
  globalUrl = {};
  STAT_ENDPOINT = '';

  ngOnInit() {
    // this.mailUserGroupIdVo.userId
    this.loadGroups();
    this.loadUsers();
    this.loadMailInterfaceInfo();
  }

  loadMailInterfaceInfo() {
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
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/groups/survey',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.mailGroupVos = result;
        });
  }

  loadBindGroups(){
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/groups/survey',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.bindMailGroupVos = result;
        });
  }

  loadUsers(){
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/survey',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.userDataTable = result;
        });
  }

  loadBindUsers(){
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/survey',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.userBindDataTable = result;
        });
  }

  mailGroupVo : MailGroupVo = {};;

  mailGroupVos : MailGroupVo[] = [];

  bindMailGroupVos : MailGroupVo[] = [];

  mailUserGroupIdVo : MailUserGroupIdVo = {};

  mailUserPo : MailUserPo = {};

  mailInterfaceInfo : MailInterfaceInfo = {};

  totalRecords = 0;

  page :number = 0;

  size :number = 0;

  //通知组管理方法在此
  bindMember(noticeGroupManageData) {
    console.log('noticeGroupManageData.gid:'+noticeGroupManageData.gid);
    this.mailUserGroupIdVo.groupId = noticeGroupManageData.gid;
    this.loadBindUsers();
    this.bindMemberDisplay = true;

  }

  bindUserToGroup(bindMemberData){
    this.mailUserGroupIdVo.userId = bindMemberData.userId;
    console.log('this.mailUserGroupIdVo.userId:'+this.mailUserGroupIdVo.userId);
    console.log('this.mailUserGroupIdVo.groupId:'+this.mailUserGroupIdVo.groupId);
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/group/add',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.loadBindUsers();
          // this.mailUserGroupIdVo = {};
          this.loadGroups();
          this.showInfo('success','bind success');
        });
  }

  unbindUserToGroup(bindMemberData){
    this.mailUserGroupIdVo.userId = bindMemberData.userId;
    console.log('this.mailUserGroupIdVo.userId:'+this.mailUserGroupIdVo.userId);
    console.log('this.mailUserGroupIdVo.groupId:'+this.mailUserGroupIdVo.groupId);
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/group/del',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.loadBindUsers();
          // this.mailUserGroupIdVo = {};
          this.loadGroups();
          this.showInfo('success','unbind success');
        });
  }

  bindGroupToUser(noticeGroupInDialogDataGridTab2DataList){
    this.mailUserGroupIdVo.groupId = noticeGroupInDialogDataGridTab2DataList.gid;
    console.log('this.mailUserGroupIdVo.userId:'+this.mailUserGroupIdVo.userId);
    console.log('this.mailUserGroupIdVo.groupId:'+this.mailUserGroupIdVo.groupId);
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/group/add',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.loadBindGroups();
          // this.mailUserGroupIdVo = {};
          this.loadUsers();
          this.showInfo('success','bind success');
        });
  }

  unBindGroupToUser(noticeGroupInDialogDataGridTab2DataList){
    this.mailUserGroupIdVo.groupId = noticeGroupInDialogDataGridTab2DataList.gid;
    console.log('this.mailUserGroupIdVo.userId:'+this.mailUserGroupIdVo.userId);
    console.log('this.mailUserGroupIdVo.groupId:'+this.mailUserGroupIdVo.groupId);
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/group/del',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.loadBindGroups();
          // this.mailUserGroupIdVo = {};
          this.loadUsers();
          this.showInfo('success','unbind success');
        });
  }

  editGroupManage(noticeGroupName) {
    this.addNoticeGroupDisplay = true;
    this.noticeGroupNameInDialog = noticeGroupName.groupName;
    this.noticeGroupIdInDialog = noticeGroupName.gid;
  }

  deleteGroup(noticeGroupManageData) {
    this.confirmationService.confirm({
          message: 'delete ? ',
          accept:() => {
            this.mailUserGroupIdVo.groupId = noticeGroupManageData.gid;
            this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/groups/del',this.mailUserGroupIdVo)
                .subscribe(result => {
                  this.authService.appendLogWithContent('/workspace/report/email', 'reportEmail', 'remove group:'+JSON.stringify(noticeGroupManageData)).subscribe(result => {}, error => { });
                  this.loadGroups();
                  this.statVo = result;
                  if ( this.statVo.stat=='success' ) {
                    this.showInfo('success', 'delete success');
                  }
                  if ( this.statVo.stat=='fail' ) {
                    this.showInfo('group is not empty','group is not empty');
                  }
                });
          }
    });

  }
  addNoticeGroup() {
    this.addNoticeGroupDisplay = true;
  }
  commitNewNoticeGroup() {
    if(this.noticeGroupNameInDialog == undefined || this.noticeGroupNameInDialog == ''){
      this.showInfo('fail','missing group name');
    }
    else{
      this.mailGroupVo.groupName = this.noticeGroupNameInDialog;
      this.mailGroupVo.gid = this.noticeGroupIdInDialog;
      this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/groups/merge', this.mailGroupVo)
          .subscribe(result => {
            this.authService.appendLogWithContent('/workspace/report/email', 'reportEmail', 'add or update group:'+JSON.stringify(this.noticeGroupNameInDialog)).subscribe(result => {}, error => { });
            this.addNoticeGroupDisplay=false;
            this.loadGroups();
            this.showInfo('success','save success');
          });
    }
  }

  //通知组管理方法结束
  //通知成员管理
  addMember() {
    this.userNameInDialog = null;
    this.userEmailInDialog = null;
    this.cellPhoneNumberInDialog = null;
    this.addMemberDisplay = true;
  }
  bindNoticeGroup(userData) {
    this.mailUserGroupIdVo.userId = userData.userId;
    this.loadBindGroups();
    this.bindGroupDisplay = true;
  }
  editUser(userData) {
    console.log('userData:'+userData);
    this.addMemberDisplay = true;
    this.userIdInDialog = userData.userId;
    this.userNameInDialog = userData.userName;
    this.userEmailInDialog = userData.email;
    this.cellPhoneNumberInDialog = userData.phone;
  }
  deleteUser(userData) {
    this.confirmationService.confirm({
          message: 'delete ? ',
          accept:() => {
            this.mailUserPo.userId = userData.userId;
            this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/del', this.mailUserPo)
                .subscribe(result => {
                  this.authService.appendLogWithContent('/workspace/report/email', 'reportEmail', 'remove user:'+JSON.stringify(userData)).subscribe(result => {}, error => { });
                  this.userIdInDialog = '';
                  this.loadUsers();
                  this.showInfo('success','delete success');
                });
          }
    });

  }
  commitNewUser() {
    if(this.userNameInDialog != undefined && this.userNameInDialog != ''){
      if(this.userEmailInDialog != undefined && this.userEmailInDialog != ''){
        this.mailUserPo.userId = this.userIdInDialog;
        this.mailUserPo.userName = this.userNameInDialog;
        this.mailUserPo.email = this.userEmailInDialog;
        this.mailUserPo.phone = this.cellPhoneNumberInDialog;
        this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/users/merge', this.mailUserPo)
            .subscribe(result => {
              this.authService.appendLogWithContent('/workspace/report/email', 'reportEmail', 'add or update user:'+JSON.stringify(this.mailUserPo.userName)).subscribe(result => {}, error => { });
              this.addMemberDisplay=false;
              this.userIdInDialog = '';
              this.loadUsers();
              this.showInfo('success','save success');
            });
      }
      else{
        this.showInfo('fail','missing email');
      }
    }
    else{
      this.showInfo('fail','missing username');
    }
  }
  saveEmailSendInterface(){
    const cmdParams = new URLSearchParams();
    cmdParams.append('command', this.messageSendInterface);
    cmdParams.append('miId', this.messageSendId);
    this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/mail/mailinterface/edit', cmdParams)
        .subscribe(result => {
          this.authService.appendLogWithContent('/workspace/report/email', 'reportEmail', 'SendInterface:'+JSON.stringify(this.messageSendInterface)).subscribe(result => {}, error => { });
          this.showInfo('success','save success');
        });
  }

  showInfo(type,message) {
        this.msgs = [];
        this.msgs.push({severity : type, summary : 'Message', detail : message});
  }

  msgs = [];
  statVo:StatVo = {};
  //通知组管理属性
  noticeGroupManageDataTable = [];
  noticeGroupName: string;
  noticeGroupNameInDialog: string;
  noticeGroupIdInDialog: string;
  emailList: string;
  addNoticeGroupDisplay: boolean = false;
  bindMemberDisplay: boolean = false;

  bindMemberDataTable = [];
  userName: string;
  userEmail: string;
  cellPhoneNumber: string;
  //通知组管理属性结束
  //通知成员属性
  userDataTable = [];
  userBindDataTable = [];
  userNameField: string;
  userEmailField: string;
  cellPhoneNumberField: string;
  userNameInDialog: string;
  userIdInDialog: string;
  userEmailInDialog: string;
  cellPhoneNumberInDialog: string;
  addMemberDisplay: boolean = false;
  bindGroupDisplay: boolean = false;
  noticeGroupInDialogDataGridTab2Table = [];
  emailGroups = [];
  //短信发送接口属性
  messageSendInterface:string;
  messageContent:string;
  messageSendId:string;
}
