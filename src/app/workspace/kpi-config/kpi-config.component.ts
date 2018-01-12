import { Component, OnInit } from '@angular/core';
import { KpiConfigService, KpiConfigData } from './kpi-config.service';
import { AuthService } from '../../auth/auth.service';
import { ConfirmDialogModule, ConfirmationService, SelectItem, Message } from 'primeng/primeng';

import * as moment from 'moment';
@Component({
  selector: 'ices-kpi-config',
  templateUrl: './kpi-config.component.html',
  styleUrls: ['./kpi-config.component.css'],
  providers: [ConfirmationService]
})
export class KpiConfigComponent implements OnInit {

  alarmLevels = [{label:'*',value:'*'},{label:'**',value:'**'},{label:'***',value:'***'}];

  selectAlarmLevel = '*';

  neTypeList = [];

  selectNeType = '';
  constructor(
    private kpiConfigService: KpiConfigService,
    private confirmationService: ConfirmationService,
    private authService: AuthService) {



    this.kpiConfigService.getResources('comparedMethods').subscribe(result=>{
      this.comparedMethods = [{ label: 'All comparator', value: null }];
      result.forEach(item => {
        this.comparedMethods.push({ label: item.comparedMethodLabel, value: item.comparedMethod });
      });
    });
    // this.comparedMethods = [];
    // this.comparedMethods.push({ label: '请选择比较方法', value: null });
    // this.comparedMethods.push({ label: '大于', value: '>' });
    // this.comparedMethods.push({ label: '小于', value: '<' });
    this.kpiUnits = [];
    this.kpiUnits.push({label: 'ratio', value: 'ratio'});
    this.kpiUnits.push({label: 'value', value: 'value'});
    this.kpiEnables = [];
    this.kpiEnables.push({label: 'ON', value: true});
    this.kpiEnables.push({label: 'OFF', value: false});
    this.kpiConfigService.getResources('outPutFields').subscribe(result=>{
      this.outPutFields = [{ label:'All KPI types',value:null}];
      result.forEach(item=>{
          this.outPutFields.push({label:item.outPutFieldName,value:item.outPutFieldCode});
      })
    });
    // this.outPutFields = [];
    // this.outPutFields.push({ label:'请选择KPI类型',value:null});
    // this.outPutFields.push({ label:'成功率',value:'success_rate'});
    // this.outPutFields.push({ label:'成功次数',value:'success_count'});
    // this.outPutFields.push({ label:'失败率',value:'fail_rate'});
    // this.outPutFields.push({ label:'失败次数',value:'fail_count'});
    // this.outPutFields.push({ label:'请求次数',value:'total_count'});

    this.kpiConfigService.getResources('kpiCategorys').subscribe(result=>{
      this.kpiCategorys = [{label:'All KPI categories' ,value:null}];
      result.forEach(item=>{
          this.kpiCategorys.push({label:item.categoryName,value:item.categoryCode});
      })
    });

    this.kpiConfigService.getDropdownInfo().subscribe(result=>{
        this.neTypeList = result['neType'];
        this.selectNeType = this.neTypeList.length > 0 ? this.neTypeList[0]['value'] : '';
    });
  }

  ngOnInit() {
    this.getKpiConfigDataTable();
  }

  commitNewData(){

    let kpiConfigDataInDialog = {
      id: this.id,
      kpiName: this.kpiNameInDialog,
      kpiCode: this.kpiCodeInDialog,
      outPutField :this.outPutFieldSelected,
      kpiCategory :this.kpiCategorySelected,
      comparedMethod:this.comparedMethodSelected,
      monitorTimeStart : moment(this.monitorTimeStart).format('HH:mm'),
      monitorTimeEnd : moment(this.monitorTimeEnd).format('HH:mm'),
      monitorTimeString:null,
      kpiUnit: this.kpiUnitSelected,
      requestSample:this.requestSampleInDialog,
      threshold:this.thresholdInDialog,
      thresholdCancel:this.thresholdCancelInDialog,
      kpiQueryScript:this.kpiQueryScriptInDialog,
      alarmLevel:this.selectAlarmLevel,
      kpiNeType:this.selectNeType,
      kpiEnabled:this.kpiEnableSelected
    }
    if(kpiConfigDataInDialog.monitorTimeStart.indexOf(':')>0&&kpiConfigDataInDialog.monitorTimeEnd.indexOf(':')>0){
      kpiConfigDataInDialog.monitorTimeString = kpiConfigDataInDialog.monitorTimeStart+'-'+kpiConfigDataInDialog.monitorTimeEnd
    }
    this.msgs = [];
    if(kpiConfigDataInDialog.id!=null){
      this.kpiConfigService.editOrAddKpiConfig(kpiConfigDataInDialog).subscribe((result) => {
          this.getKpiConfigDataTable();
          this.msgs.push({ severity: 'info', summary: 'Confirmed', detail: 'Record edited' });
          const logContent = 'Update KPI Config :' + kpiConfigDataInDialog.kpiCode;
          this.authService.appendLogWithContent('', '', logContent)
          .subscribe(logResult => { }, error => { });
      });


    }else{
      this.kpiConfigService.editOrAddKpiConfig(kpiConfigDataInDialog).subscribe((result) => {
          this.getKpiConfigDataTable();
          this.msgs.push({ severity: 'success', summary: 'Confirmed', detail: 'Record added' });

          const logContent = 'Add KPI Config :' + kpiConfigDataInDialog.kpiCode;
          this.authService.appendLogWithContent('', '', logContent)
          .subscribe(logResult => { }, error => { });
      });

    }

  }


  add() {
    this.id = null;
    this.display = true;
    this.kpiNameInDialog = null;
    this.kpiCodeInDialog = null;
    this.outPutFieldSelected = null;
    this.kpiCategorySelected = null;
    this.comparedMethodSelected = null;
    this.requestSampleInDialog = null;
    this.thresholdInDialog = null;
    this.thresholdCancelInDialog = null;
    this.kpiQueryScriptInDialog = null;
    this.monitorTimeEnd=null;
    this.monitorTimeStart=null;
    this.selectAlarmLevel = '*';
    this.kpiUnitSelected = 'value';
    this.selectNeType = this.neTypeList.length > 0 ? this.neTypeList[0]['value'] : '';
    this.kpiEnableSelected = true;
  }
  edit(kpiConfigData) {
    this.display = true;
    //Dialog 赋值
    console.log(kpiConfigData);
    this.kpiNameInDialog = kpiConfigData.kpi_name;
    this.outPutFieldSelected = kpiConfigData.kpi_unit;
    this.kpiCategorySelected = kpiConfigData.kpi_category;
    this.comparedMethodSelected = kpiConfigData.compared_method;
    this.requestSampleInDialog = kpiConfigData.request_sample;
    this.thresholdInDialog = kpiConfigData.threshold;
    this.thresholdCancelInDialog = kpiConfigData.threshold_cancel;
    this.kpiQueryScriptInDialog = kpiConfigData.kpi_query_script;
    this.id = kpiConfigData.id;
    this.selectNeType = kpiConfigData.kpi_ne_type;
    this.selectAlarmLevel = kpiConfigData.alarm_level;
    this.kpiCodeInDialog = kpiConfigData.kpi_code;
    this.monitorTimeString = kpiConfigData.monitor_time_string;
    this.kpiUnitSelected = kpiConfigData.kpi_unit;
    this.kpiEnableSelected = kpiConfigData.kpi_enabled;
    if(kpiConfigData.monitor_time_string!=null){
      let startTime = kpiConfigData.monitor_time_string.split('-')[0];
      let endTime = kpiConfigData.monitor_time_string.split('-')[1];
      let startTimeHour = startTime.split(':')[0];
      let startTimeMin = startTime.split(':')[1];
      let endTimeHour = endTime.split(':')[0];
      let endTimeMin = endTime.split(':')[1];
      this.monitorTimeStart = moment().hour(startTimeHour).minute(startTimeMin).toDate();
      this.monitorTimeEnd = moment().hour(endTimeHour).minute(endTimeMin).toDate();
    }else{
      this.monitorTimeStart = null;
      this.monitorTimeEnd = null;
    }
  }
  confirmDelete(kpiConfigDataId) {
    this.confirmationService.confirm({
      message: 'Are you sure to delete this?',
      header: 'Delete confirm',
      icon: 'fa fa-trash',
      accept: () => {
        this.delete(kpiConfigDataId);
      }
    });
  }
  delete(kpiConfigData) {
    this.kpiConfigService.deleteKpiConfig(kpiConfigData.id).subscribe(() => {
        // this.kpiConfigDataTable.splice(this.kpiConfigDataTable.indexOf(kpiConfigData), 1);
        this.msgs = [];
        this.getKpiConfigDataTable();
        this.msgs.push({ severity: 'error', summary: 'Confirmed', detail: 'Record deleted' });
        const logContent = 'Remove KPI Config :' + kpiConfigData.kpi_code;
        this.authService.appendLogWithContent('', '', logContent)
        .subscribe(logResult => { }, error => { });
    });

  }
  getKpiConfigDataTable() {

    this.kpiConfigService.getAllKpiConfig().subscribe(

      resultData => {

        this.kpiConfigDataTable = resultData;
        this.totalRecords = resultData.length;

      });

  }
  //data table attributes
  kpiConfigDataTable = [];
  totalRecords: number;
  kpiName: string;
  kpiQueryScript: string;
  outPutField: string;
  comparedMethod: string;
  monitorTimeString: string;
  requestSample: number;
  threshold: number;
  thresholdCancel: number;

  msgs: Message[] = [];
  // dialog attributes
  display: boolean = false;
  id:number;
  kpiNameInDialog:string;

  outPutFields: SelectItem[];
  outPutFieldSelected: string;

  kpiCategorys: SelectItem[];
  kpiCategorySelected:string;
  kpiUnits : SelectItem[];
  kpiUnitSelected : string;
  kpiEnables : SelectItem[];
  kpiEnableSelected : boolean;
  comparedMethods: SelectItem[];
  comparedMethodSelected: string;

  monitorTimeStart:Date;
  monitorTimeEnd:Date;
  requestSampleInDialog:number;
  thresholdInDialog:number;
  thresholdCancelInDialog:number;
  kpiQueryScriptInDialog:string;
  kpiCodeInDialog:string;
}
