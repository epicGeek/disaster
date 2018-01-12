import { Component, OnInit } from '@angular/core';
import { MenuItem, ConfirmationService} from 'primeng/primeng';
import { ReportCommonService, StatVo } from '../report-common.service';
import { CommTemplet } from './report-setting.service';
import {
  Http, Headers, URLSearchParams,
  Response, RequestOptions
} from '@angular/http';
import {FileUploadModule} from 'primeng/primeng';
import { AuthService} from '../../../auth/auth.service';
@Component({
  selector: 'ices-report-setting',
  templateUrl: './report-setting.component.html',
  styleUrls: ['./report-setting.component.css'],
  providers: [ReportCommonService, ConfirmationService]
})
export class ReportSettingComponent implements OnInit {

  constructor(private reportCommonService: ReportCommonService,private authService:AuthService) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.STAT_ENDPOINT = apiConfig['reportURL'];
    this.uploadUrl = this.STAT_ENDPOINT + '/set/uploadSqlFile';
  }
  globalUrl = {};
  STAT_ENDPOINT = '';
  uploadUrl = '';

  ngOnInit() {
    // this.templateMainTitle = "江西移动EPC核心网运行报告";

    // this.allNetworkInfoDesc = "利用对全网主要网元的状态进行每日或1周数据的汇总,日报和周报均要求输出变化对比，方便检查比较。";
    // this.historyAlarmCategoryDesc = "告警量进行统计数量统计。通常情况下，发送的告警总量不超过20条，如果告警总量超过平均值，通过分析后建议及时调整指标门限或者告警算法来减少告警总量。";
    this.loadCommTemplet();
  }

  commTemplet : CommTemplet = {};
  selectedBackupContent : string [] = [];
  templateMainTitle : string;
  overallStateDesc :string;
  allNetworkInfoDesc :string;
  historyAlarmCategoryDesc :string;
  statVo : StatVo = {};
  backdupDisbled : boolean = false;
  msgs = [];
  restoreSqlPath : string = '';

  loadCommTemplet(){
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/set/commTemplet/view')
        .subscribe(result => {
          this.commTemplet = result;
        });
  }

  saveCommTemplet() {
    if (this.commTemplet.modalTitle == undefined || this.commTemplet.modalTitle == ''){
      this.showInfo('fail','missing common model title');
    }
    else{
      this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/set/dhssCommTemplet/edit',this.commTemplet)
        .subscribe(result => {
          this.authService.appendLogWithContent('/workspace/report/setting', 'reportSetting', 'save Template general settings:'+this.commTemplet).subscribe(result => {}, error => { });
          this.loadCommTemplet();
          this.showInfo('success','save success');
        });
    }

  }

  showInfo(type,message) {
        this.msgs = [];
        this.msgs.push({severity:type, summary:'Message', detail:message});
  }

  backupSettings(){
    if(this.selectedBackupContent.length==0){
      this.showInfo('fail','no content selected');
      return;
    }
    let tableTypes = '';
    this.selectedBackupContent.forEach(ctt => {
      tableTypes += ctt + ',';
    });
    this.backdupDisbled = true;
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/set/dhssbackUpDatas?tableTypes='+tableTypes)
        .subscribe(result => {
          this.authService.appendLogWithContent('/workspace/report/setting', 'reportSetting', 'exec backup:'+tableTypes).subscribe(result => {}, error => { });
          this.statVo = result;
          this.backdupDisbled = false;
          if(this.statVo.stat=='fail'){
            this.showInfo('fail','backup error');
          }else{
            window.open(this.STAT_ENDPOINT + this.statVo.stat);
          }
        },error => {
          this.showInfo('fail','backup error');
        });
    // const backupParams = new URLSearchParams();
    // backupParams.append('tableTypes', tableTypes);
    // this.reportCommonService.saveDatasWithXform(environment.STAT_ENDPOINT + '/set/dhssbackUpDatas',backupParams)
    //   .subscribe(result => {

    //   });
  }

  upload(event){
      this.restoreSqlPath = event.xhr.responseText;
      if (this.restoreSqlPath == 'notsql'){
        this.showInfo('fail','file format error');
        this.restoreSqlPath = '';
      }
      else{
        this.showInfo('success','upload success');
      }

  }

  restore(){
    if (this.restoreSqlPath == undefined || this.restoreSqlPath == ''){
      this.showInfo('fail','upload sql file first');
    }
    else{
      const restoreParams = new URLSearchParams();
      restoreParams.append('targetFilePath', this.restoreSqlPath);
      this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/set/restorefromsql',restoreParams)
        .subscribe(result => {
          this.authService.appendLogWithContent('/workspace/report/setting', 'reportSetting', 'exec recovery:'+this.restoreSqlPath).subscribe(result => {}, error => { });
          this.statVo = result;
          if(this.statVo.stat=='success'){
            this.showInfo('success','restore success');
          }
          else{
            this.showInfo('fail','restore failed');
          }
        });
    }

  }
}
