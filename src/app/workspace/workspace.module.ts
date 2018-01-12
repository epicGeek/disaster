import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { WorkspaceComponent } from './workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { OneClickAccessComponent } from './one-click-access/one-click-access.component';
import { NavigateModule } from './navigate/navigate.module';
import { NavigateService } from './navigate/navigate.service';

import { MaintainComponent } from './maintain/maintain.component';
import { MaintainService } from './maintain/maintain.service';

import { TopologicalComponent } from './topological/topological.component';


import { SmartHomeComponent } from './smart/smart-home/smart-home.component';
import { SmartManageComponent } from './smart/smart-manage/smart-manage.component';
import { SmartResultComponent } from './smart/smart-result/smart-result.component';
import { SmartResultFilterComponent } from './smart/smart-result-filter/smart-result-filter.component';
import { SmartResultDetailComponent } from './smart/smart-result-detail/smart-result-detail.component';

import { SmartManageService } from './smart/smart-manage/smart-manage.service';
import { SmartResultService } from './smart/smart-result/smart-result.service';
import { SmartResultFilterService } from './smart/smart-result-filter/smart-result-filter.service';
import { SmartResultDetailService } from './smart/smart-result-detail/smart-result-detail.service';

import { SubscriberDataAnalyseConfigService } from './subscriber-data-analyse-config/subscriber-data-analyse-config.service';

import {SpinnerModule, CalendarModule, DataTableModule, SharedModule, DialogModule, DropdownModule,
  InputTextModule, ButtonModule, AccordionModule, CheckboxModule, PanelModule, GrowlModule,
InputSwitchModule, SplitButtonModule, BreadcrumbModule, InputTextareaModule, ProgressBarModule, BlockUIModule,
OrderListModule, TabViewModule, TreeModule, RadioButtonModule, ContextMenuModule, PickListModule,
ConfirmDialogModule, SlideMenuModule, MultiSelectModule, MegaMenuModule, ConfirmationService, FileUploadModule,
ChipsModule, MessagesModule } from 'primeng/primeng';

// import { ChartsModule } from 'ng2-charts';
import { AlarmMonitorCustomComponent } from './alarm/alarm-monitor-custom/alarm-monitor-custom.component';
import { AlarmMonitorCustomService } from './alarm/alarm-monitor-custom/alarm-monitor-custom.service';

import { AlarmMonitorHistoryComponent } from './alarm/alarm-monitor-history/alarm-monitor-history.component';
import { AlarmMonitorHistoryService } from './alarm/alarm-monitor-history/alarm-monitor-history.service';


import { AlarmMonitorComponent } from './alarm-monitor/alarm-monitor.component';
import { AlarmMonitorService } from './alarm-monitor/alarm-monitor.service';
import { SingleUserQueryComponent } from './single-user-query/single-user-query.component';
import { SingleUserQueryService } from './single-user-query/single-user-query.service';
import { MainKpiComponent } from './main-kpi/main-kpi.component';
import { MainKpiService } from './main-kpi/main-kpi.service';
import { CheckItemComponent } from './check-item/check-item.component';

import { CheckItemService } from './check-item/check-item.service';
import { SystemOperationLogComponent } from './system-operation-log/system-operation-log.component';
import { SystemOperationLogService } from './system-operation-log/system-operation-log.service';
import { KpiMonitorComponent } from './kpi-monitor/kpi-monitor.component';
import { KpiMonitorService } from './kpi-monitor/kpi-monitor.service';
import { PgwLogComponent } from './pgw-log/pgw-log.component';
import { PgwLogService } from './pgw-log/pgw-log.service';
import { KpiConfigComponent } from './kpi-config/kpi-config.component';
import { KpiConfigService } from './kpi-config/kpi-config.service';
import { UnitManageComponent } from './unit-manage/unit-manage.component';
import { UnitManageService } from './unit-manage/unit-manage.service';
import { NumberManageComponent } from './number-manage/number-manage.component';
import { NumberManageService } from './number-manage/number-manage.service';

import { ReportComponent } from './report/report-access/report.component';
import { ReportAccessService } from './report/report-access/report-access.service';
import { ReportCreateComponent } from './report/report-create/report-create.component';
import { ReportCreateService } from './report/report-create/report-create.service';
import { TaskConfigComponent } from './report/task-config/task-config.component';
import { TaskConfigService } from './report/task-config/task-config.service';
import { ReportEmailComponent } from './report/report-email/report-email.component';
import { NetWorkComponent } from './report/net-work/net-work.component';
import { NetWorkService } from './report/net-work/net-work.service';
import { ReportDefineComponent } from './report/report-define/report-define.component';
import { ReportSettingComponent } from './report/report-setting/report-setting.component';
import { ReportAlarmComponent } from './report/report-alarm/report-alarm.component';
import { OneClickAccessService } from './one-click-access/one-click-access.service';
import { MultiUserQueryService } from './multi-user-query/multi-user-query.service';
import { ChartModule } from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';
import { MultiUserQueryComponent } from './multi-user-query/multi-user-query.component';
import { AhubConnInfoComponent } from './ahub-conn-info/ahub-conn-info.component';
import { AhubConnInfoService } from './ahub-conn-info/ahub-conn-info.service';
import { SubscriberDataAnalyseConfigComponent } from './subscriber-data-analyse-config/subscriber-data-analyse-config.component';
import { AlarmRuleComponent } from './alarm-rule/alarm-rule.component';
import { AlarmRuleService } from './alarm-rule/alarm-rule.service';
import { SubscriberManageComponent } from './subscriber-manage/subscriber-manage.component';
import { SubscriberManageService } from './subscriber-manage/subscriber-manage.service';
import { SubscriberCommandManageComponent } from './subscriber-command-manage/subscriber-command-manage.component';
import { SubscriberCommandManageService } from './subscriber-command-manage/subscriber-command-manage.service';
import { BossMonitorComponent } from './boss-monitor/boss-monitor.component';
import { BossMonitorService } from './boss-monitor/boss-monitor.service';
import { SignalingQueryRecordComponent } from './signaling-query-record/signaling-query-record.component';
import { SignalingQueryRecordService } from './signaling-query-record/signaling-query-record.service';
import { BossStatisticComponent } from './boss-statistic/boss-statistic.component';
import { BossStatisticService } from './boss-statistic/boss-statistic.service';
import { VolteCounterComponent } from './volte/volte-counter/volte-counter.component';
import { VolteCounterService } from './volte/volte-counter/volte-counter.service';
import { VolteMessageComponent } from './volte/volte-message/volte-message.component';
import { VolteMessageService } from './volte/volte-message/volte-message.service';
import { VolteAlarmComponent } from './volte/volte-alarm/volte-alarm.component';
import { VolteAlarmService } from './volte/volte-alarm/volte-alarm.service';
import { VolteReportComponent } from './volte/volte-report/volte-report.component';
import { VolteReportService } from './volte/volte-report/volte-report.service';
import { ImsUnitLogComponent } from './ims-unit-log/ims-unit-log.component';
export function highchartsFactory() {
  return highcharts;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WorkspaceRoutingModule,
    SharedModule,
    SpinnerModule,
    CalendarModule, DataTableModule, DialogModule, DropdownModule,
    InputTextModule, ButtonModule, NavigateModule, AccordionModule, CheckboxModule, PanelModule, GrowlModule,
    InputSwitchModule, SplitButtonModule, BreadcrumbModule, InputTextareaModule, ProgressBarModule, BlockUIModule,
    OrderListModule, TabViewModule, TreeModule, RadioButtonModule, ContextMenuModule,
    ConfirmDialogModule, SlideMenuModule, ButtonModule, NavigateModule, AccordionModule, CheckboxModule, PanelModule,
    GrowlModule, ChartModule, MultiSelectModule, MegaMenuModule, FileUploadModule, PickListModule, ReactiveFormsModule,
    ChipsModule, MessagesModule
  ],
  declarations: [
    WorkspaceComponent,
    OneClickAccessComponent,
    TopologicalComponent,
    MaintainComponent,
    SmartHomeComponent,
    SmartManageComponent,
    SmartResultComponent,
    SmartResultFilterComponent,
    SmartResultDetailComponent,
    AlarmMonitorComponent,
    SingleUserQueryComponent,
    MainKpiComponent, CheckItemComponent,
    SingleUserQueryComponent,
    SystemOperationLogComponent,
    TaskConfigComponent, NetWorkComponent,
    KpiMonitorComponent, PgwLogComponent,
    KpiConfigComponent, UnitManageComponent,
    ReportComponent, ReportCreateComponent,
    ReportEmailComponent,  ReportDefineComponent,
    ReportSettingComponent, ReportAlarmComponent,
    NumberManageComponent, AlarmMonitorCustomComponent,
    AlarmMonitorHistoryComponent,  MultiUserQueryComponent,
    SubscriberDataAnalyseConfigComponent, AhubConnInfoComponent,
    AlarmRuleComponent, SubscriberManageComponent, SubscriberCommandManageComponent,
    BossMonitorComponent, BossStatisticComponent, SignalingQueryRecordComponent,
    VolteCounterComponent, VolteMessageComponent, VolteAlarmComponent, VolteReportComponent, ImsUnitLogComponent],
  exports: [],

  providers: [
    {
        provide: HighchartsStatic,
        useFactory: highchartsFactory
    },
    MaintainService,
    NavigateService,
    SmartManageService,
    SmartResultService,
    SmartResultDetailService,
    SmartResultFilterService,
    AlarmMonitorService,
    SingleUserQueryService,
    MainKpiService,
    CheckItemService,
    SystemOperationLogService,
    KpiMonitorService,
    PgwLogService,
    KpiConfigService,
    UnitManageService,
    NumberManageService,
    ConfirmationService,
    ReportAccessService,
    ReportCreateService,
    TaskConfigService,
    NetWorkService,
    AlarmMonitorCustomService,
    AlarmMonitorHistoryService,
    OneClickAccessService,
    MultiUserQueryService,
    SubscriberDataAnalyseConfigService,
    AhubConnInfoService,
    AlarmRuleService,
    SubscriberCommandManageService,
    SubscriberManageService,
    BossMonitorService,
    SignalingQueryRecordService,
    BossStatisticService,
    VolteAlarmService,
    VolteCounterService,
    VolteReportService,
    VolteMessageService
  ]
})
export class WorkspaceModule { }
