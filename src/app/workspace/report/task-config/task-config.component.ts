import { Component, OnInit } from '@angular/core';
import { TaskConfigService, TaskJob, MailUserPo, PageHistory, HistoryVo } from './task-config.service';
import { MenuItem, ConfirmationService} from 'primeng/primeng';
import { ReportCommonService, StatVo } from '../report-common.service';
import {
  ReportMailService, MailGroupVo, MailUserGroupIdVo,
  PageGroup, MailInterfaceInfo
} from '../report-email/report-email.service';
import {
  Http, Headers, URLSearchParams,
  Response, RequestOptions
} from '@angular/http';
import * as moment from 'moment';
import { AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'ices-task-config',
  templateUrl: './task-config.component.html',
  styleUrls: ['./task-config.component.css'],
  providers: [ReportCommonService, ConfirmationService]
})
export class TaskConfigComponent implements OnInit {

  constructor(private reportCommonService: ReportCommonService,
              private taskConfigService:TaskConfigService,
              private confirmationService:ConfirmationService,private authService:AuthService) {
                const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
                this.STAT_ENDPOINT = apiConfig['reportURL'];
               }

  globalUrl = {};
  STAT_ENDPOINT = '';

  ngOnInit() {
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/templet/dhsstemplets/options')
        .subscribe(result => {
          this.checkBoxData = result;
        });
    this.loadGroups();

  }

  count(){
    this.loadTasks(1,this.size);
  }

  recount(){
    this.beginTime = '';
    this.endTime = '';
    this.loadTasks(1,this.size);
  }

  loadTaskLazy(event){
      this.page = event.first/event.rows + 1;
      this.size = event.rows;
      this.loadTasks(this.page,this.size);
  }

  loadTasks(page,size){
    let params = '';
    if(this.beginTime!=''){
      this.beginTime = moment(this.beginTime).format('YYYY-MM-DD HH:mm');
      params += '&startTime='+this.beginTime;
    }
    if(this.endTime!=''){
      this.endTime = moment(this.endTime).format('YYYY-MM-DD HH:mm');
      params += '&endTime='+this.endTime;
    }
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/interval/tasks/page?page='+page+"&size="+size+params)
        .subscribe(result => {
          this.pageHistory = result;
          this.taskList = this.pageHistory.dataList;
          this.totalRecords = this.pageHistory.totalRecords;
        });
  }

  msgs  = [];

  execTypes = [
    '一天','一周','一个月'
  ];

  taskJob : TaskJob = {};

  selectedContent = [];

  totalRecords = 0;

  page :number = 0;

  size :number = 0;

  pageHistory :PageHistory = {};

  taskList = [];

  beginTime = '';

  endTime = '';

  groups = [
      // { name :'维护组'  }
  ];

  mailUserGroupIdVo : MailUserGroupIdVo = {};

  runRates = [
    {label:'Daily', value:'daily'},
    {label:'Weekly', value:'weekly'}
  ];

  selectedrate = 'daily';

  theSelectedGroup = {};

  selectedGroup = [];

  selectedUser = [];

  tmpSelectedUser = [];

  checkBoxData = [
      // { label :'JiangXiMcc_All_Network_Status_Report_ALL_old' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_ALL' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_MME' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_SAEGW' , value :'' },
      // { label :'JiangXiMcc_All_Network_Status_Report_summary' , value :'' }
  ];

  // loadLazy(event){
  //     this.taskList.push({ taskName:'test1',taskDesc:'...',createUser:'admin',startTime:new Date(),execType:0,nextTime:new Date(),status:true });
  //     this.taskList.push({ taskName:'test2',taskDesc:'...',createUser:'admin',startTime:new Date(),execType:1,nextTime:new Date(),status:false });
  // }

  editTask(taskTabView){
    if(!this.taskJob.templetId){
      this.showInfo('Please choose Task Template','missing template!');
      return;
    }
    else{
      this.selectedContent.forEach(val => {
        if(val == 'hasgs'){
          this.taskJob.hasgs = '1';
        }
        else if(val == 'gsexcel'){
          this.taskJob.gsexcel = '1';
        }
        else if(val == 'hashs'){
          this.taskJob.hashs = '1';
        }
      });

    if(this.taskJob.createTime == undefined){
      this.showInfo('Please define Task startTime','missing stat time!');
      return;
    }
    else{
      this.taskJob.createTime = moment(this.taskJob.createTime).format('YYYY-MM-DD HH:mm');

      this.taskJob.mailUserPos = [];
      this.selectedUser.forEach(suser => {
          let mailUser : MailUserPo = {  userId : suser.userId};
          this.taskJob.mailUserPos.push(mailUser);
        });

      this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/interval/task/merge', this.taskJob)
          .subscribe(result => {
            this.authService.appendLogWithContent('/workspace/report/task', 'reportTask', 'add or update task:'+JSON.stringify(this.taskJob)).subscribe(result => {}, error => { });
            this.taskJob = {};
            this.selectedContent = [];
            this.loadTasks(this.page,this.size);
            taskTabView.tabs[0].selected = true;
            taskTabView.tabs[1].selected = false;
            this.showInfo('success','save success');

          });
    }

    }
  }

  changeJobStatus(jobId,cmd){
    const changeParams = new URLSearchParams();
    changeParams.append('jobId', jobId);
    changeParams.append('cmd', cmd);
    this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/interval/changeJobStatus', changeParams)
        .subscribe(result => {
          console.log('result:' + result);
          this.loadTasks(this.page,this.size);
          this.showInfo('success','save success');
        });
  }

  status(item,flag){
      this.confirmationService.confirm({
          message: flag ? ' start ?' : 'stop ? ',
          accept:() => {
            if(flag){
              this.changeJobStatus(item.jobId,'start');
              item['status'] = '1';
            }
            else{
              this.changeJobStatus(item.jobId,'stop');
              item['status'] = '0';
            }
          }
      })
  }

  editItem(data, taskTabView,cttGs,cttGsexcel,cttHs,jobRunRate){
    this.taskJob.id = data.jobId;
    this.taskJob.createTime = data.startTime;
    this.taskJob.runrate = data.runrate;
    if(jobRunRate.options[0].value==data.runrate){
      jobRunRate.options[0].checked = true;
    }
    if(jobRunRate.options[1].value==data.runrate){
      jobRunRate.options[1].checked = true;
    }
    if(data.hasgs=='1'){
      this.selectedContent.push('hasgs');
      cttGs.checked = true;
    }

    if(data.gsexcel=='1'){
      this.selectedContent.push('gsexcel');
      cttGsexcel.checked = true;
    }

    if(data.hashs=='1'){
      this.selectedContent.push('hashs');
      cttHs.checked = true;
    }

    this.taskJob.templetId = data.templetId;
    this.taskJob.description = data.taskDesc;
    taskTabView.tabs[0].selected = false;
    taskTabView.tabs[1].selected = true;
  }

  removeItem(item){
      this.confirmationService.confirm({
          message: 'delete ? ',
          accept:() => {
              const delParams = new URLSearchParams();
              delParams.append('id', item.jobId);
              this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/interval/task/del', delParams)
                  .subscribe(result => {
                    this.authService.appendLogWithContent('/workspace/report/task', 'reportTask', 'remove task:'+JSON.stringify(item)).subscribe(result => {}, error => { });
                    this.taskList.splice(this.taskList.indexOf(item),1);
                    this.showInfo('success','delete success!');
                    this.loadTasks(this.page,this.size);
                  });
          }
      })
  }

  onChange($event){
      console.log(event);
  }

  loadGroups(){
    console.log('start loadGroups...');
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/mail/groupusers/survey',this.mailUserGroupIdVo)
        .subscribe(result => {
          this.groups = result;
        });
  }

  showInfo(type,message) {
        this.msgs = [];
        this.msgs.push({severity:type, summary:'Message', detail:message});
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

}
