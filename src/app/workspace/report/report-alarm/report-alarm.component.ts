import { Component, OnInit } from '@angular/core';
import { ReportCommonService, StatVo } from '../report-common.service';
import { Http, Headers, URLSearchParams, Response,RequestOptions } from '@angular/http';
import {MenuItem,ConfirmationService} from 'primeng/primeng';
import { ReportAlermService, PageHistory, AlermVo } from './report-alarm.service';
import { AuthService} from '../../../auth/auth.service';
@Component({
  selector: 'ices-report-alarm',
  templateUrl: './report-alarm.component.html',
  styleUrls: ['./report-alarm.component.css'],
  providers: [ReportCommonService, ConfirmationService]
})
export class ReportAlarmComponent implements OnInit {

  constructor(private reportCommonService: ReportCommonService,
              private confirmationService: ConfirmationService, private authService: AuthService) {

    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.STAT_ENDPOINT = apiConfig['reportURL'];
  }

  ngOnInit() {

  }

  globalUrl = {};
  STAT_ENDPOINT = '';

  alarmHistoryName = '';

  statVo:StatVo = {};

  msgs = [];

  totalRecords = 0;

  page :number = 0;

  size :number = 0;

  dataList = [];

  pageHistory: PageHistory = {};

  loadAlermsLazy(event){
      this.page = event.first/event.rows + 1;
      this.size = event.rows;
      this.loadAlermList(this.page,this.size);
  }

  loadAlermList(page,size){
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/templet/dhssalermName/history?page='+page+'&size='+size)
        .subscribe(result => {
          this.pageHistory = result;
          this.dataList = this.pageHistory.dataList;
          this.totalRecords = this.pageHistory.totalRecords;
          console.log('this.totalRecords:'+this.totalRecords);
        });
  }

  removeItem(data){
    console.log('data.id:'+data.id);
    this.confirmationService.confirm({
        message:'delete',
        accept:() => {
            const delParams = new URLSearchParams();
            delParams.append('caId', data.id);
            this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/templet/alermName/history/delete',delParams)
              .subscribe(result => {
                this.statVo = result;
                console.log('removeUser:'+result);
                if(this.statVo.stat=='success'){
                  this.loadAlermList(this.page,this.size);
                  this.dataList.splice(this.dataList.indexOf(data),1);
                  this.showInfo('success','Delete SUCCESS');
                }else{
                  this.showInfo('fail','Delete failed');
                }
              });
        }
    });
  }

  checkValid(){
    console.log("this.alarmHistoryName:"+this.alarmHistoryName);
    const alermParams = new URLSearchParams();
    alermParams.append('alermName', this.alarmHistoryName);
    this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/templet/alermName/detect',alermParams)
      .subscribe(result => {
        // if(result.indexOf('html>')!=-1){
        //   localStorage.setItem('serviceTicket',null);
        //   this.router.navigate(['/login']);
        // }
        this.statVo = result;
        console.log('removeUser:'+result);
        if(this.statVo.stat=='success'){
          this.showInfo('success','SUCCESS');
        }
        else{
          this.showInfo('fail','FAIL');
        }
      });

  }

  saveAlerm(){
    const alermParams = new URLSearchParams();
    alermParams.append('alermName', this.alarmHistoryName);
    this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/templet/alermName/edit',alermParams)
      .subscribe(result => {
        this.statVo = result;
         this.authService.appendLogWithContent('/workspace/report/alarm', 'reportAlarm', 'save alarm name:'+this.alarmHistoryName).subscribe(result => {}, error => { });
        if(this.statVo.stat=='success'){
          this.showInfo('success','SUCCESS');
        }
        else if(this.statVo.stat=='noexists'){
          this.showInfo('noexists','The alerm Name is Not Exists');
        }
        else if(this.statVo.stat=='isdup'){
          this.showInfo('isdup','The alerm Name have already existed');
        }
        else{
          this.showInfo('fail','FAIL');
        }
        this.loadAlermList(this.page,this.size);
      });

  }

  showInfo(type,message) {
        this.msgs = [];
        this.msgs.push({severity:type, summary:'Message', detail:message});
  }

}
