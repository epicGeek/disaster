import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';
import { OneClickAccessComponent } from './one-click-access/one-click-access.component';
import { TopologicalComponent } from './topological/topological.component';
import { MaintainComponent } from './maintain/maintain.component';
import { SmartHomeComponent } from './smart/smart-home/smart-home.component';
import { SmartManageComponent } from './smart/smart-manage/smart-manage.component';
import { SmartResultComponent } from './smart/smart-result/smart-result.component';
import { SmartResultFilterComponent } from './smart/smart-result-filter/smart-result-filter.component';
import { SmartResultDetailComponent } from './smart/smart-result-detail/smart-result-detail.component';
import { AlarmMonitorComponent } from './alarm-monitor/alarm-monitor.component';
import { SingleUserQueryComponent } from './single-user-query/single-user-query.component';
import { MainKpiComponent } from './main-kpi/main-kpi.component';
import { CheckItemComponent } from './check-item/check-item.component';
import { SystemOperationLogComponent } from './system-operation-log/system-operation-log.component';
import { KpiMonitorComponent } from './kpi-monitor/kpi-monitor.component';
import { PgwLogComponent } from './pgw-log/pgw-log.component';
import { KpiConfigComponent } from './kpi-config/kpi-config.component';
import { UnitManageComponent } from './unit-manage/unit-manage.component';
import { NumberManageComponent } from './number-manage/number-manage.component';
import { ReportComponent } from './report/report-access/report.component';
import { ReportCreateComponent } from './report/report-create/report-create.component';
import { TaskConfigComponent } from './report/task-config/task-config.component';
import { ReportEmailComponent } from './report/report-email/report-email.component';
import { NetWorkComponent } from './report/net-work/net-work.component';
import { ReportDefineComponent } from './report/report-define/report-define.component';
import { ReportSettingComponent } from './report/report-setting/report-setting.component';
import { ReportAlarmComponent } from './report/report-alarm/report-alarm.component';
import { AlarmMonitorCustomComponent } from './alarm/alarm-monitor-custom/alarm-monitor-custom.component';
import { AlarmMonitorHistoryComponent } from './alarm/alarm-monitor-history/alarm-monitor-history.component';
import { MultiUserQueryComponent } from './multi-user-query/multi-user-query.component';
import { AhubConnInfoComponent } from './ahub-conn-info/ahub-conn-info.component';
import { AuthGuard } from '../auth-guard';
import { SubscriberDataAnalyseConfigComponent } from './subscriber-data-analyse-config/subscriber-data-analyse-config.component';
import { AlarmRuleComponent } from './alarm-rule/alarm-rule.component';
import { SubscriberManageComponent } from './subscriber-manage/subscriber-manage.component';
import { SubscriberCommandManageComponent } from './subscriber-command-manage/subscriber-command-manage.component';
import { BossMonitorComponent } from './boss-monitor/boss-monitor.component';
import { BossStatisticComponent } from './boss-statistic/boss-statistic.component';
import { SignalingQueryRecordComponent } from './signaling-query-record/signaling-query-record.component';
import { VolteAlarmComponent } from './volte/volte-alarm/volte-alarm.component';
import { VolteReportComponent } from './volte/volte-report/volte-report.component';
import { VolteCounterComponent } from './volte/volte-counter/volte-counter.component';
import { VolteMessageComponent } from './volte/volte-message/volte-message.component';
import { ImsUnitLogComponent } from './ims-unit-log/ims-unit-log.component';
const workspaceRoutes: Routes = [
    {path: '', component: WorkspaceComponent ,
     children: [
      { path: 'one-click-access', component: OneClickAccessComponent,  canActivate: [ AuthGuard ] },

      { path: 'topological', component: TopologicalComponent,  canActivate: [ AuthGuard ] },
      { path: 'smart', component: SmartHomeComponent,  canActivate: [ AuthGuard ] },
      { path: 'smart/manage', component: SmartManageComponent,  canActivate: [ AuthGuard ] },
      { path: 'smart/result', component: SmartResultComponent,  canActivate: [ AuthGuard ] },
      { path: 'smart/result/filter', component: SmartResultFilterComponent,  canActivate: [ AuthGuard ] },
      { path: 'smart/result/detail', component: SmartResultDetailComponent,  canActivate: [ AuthGuard ] },
      { path: 'maintain/:filter', component: MaintainComponent,  canActivate: [ AuthGuard ] },
      { path: 'alarm/monitor', component: AlarmMonitorComponent,  canActivate: [ AuthGuard ] },
      { path: 'single/user/query', component: SingleUserQueryComponent,  canActivate: [ AuthGuard ] },
      { path: 'main/kpi', component: MainKpiComponent,  canActivate: [ AuthGuard ] },
      { path: 'check/item', component: CheckItemComponent,  canActivate: [ AuthGuard ] },
      { path: 'system/operation/log', component: SystemOperationLogComponent,  canActivate: [ AuthGuard ] },
      { path: 'kpi/monitor', component: KpiMonitorComponent,  canActivate: [ AuthGuard ]},
      { path: 'pgw/log', component: PgwLogComponent,  canActivate: [ AuthGuard ]},
      { path: 'kpi/config', component: KpiConfigComponent, canActivate: [ AuthGuard ]},
      { path: 'unit/manage', component: UnitManageComponent,  canActivate: [ AuthGuard ]},
      { path: 'number/manage', component: NumberManageComponent,  canActivate: [ AuthGuard ]},
      { path: 'report/access', component: ReportComponent,  canActivate: [ AuthGuard ]},
      { path: 'report/create', component: ReportCreateComponent,  canActivate: [ AuthGuard ]},
      { path: 'report/task', component: TaskConfigComponent,  canActivate: [ AuthGuard ]},
      { path: 'report/email', component: ReportEmailComponent,  canActivate: [ AuthGuard ] },
      { path: 'report/network', component: NetWorkComponent,  canActivate: [ AuthGuard ] },
      { path: 'report/define', component: ReportDefineComponent,  canActivate: [ AuthGuard ] },
      { path: 'report/setting', component: ReportSettingComponent,  canActivate: [ AuthGuard ] },
      { path: 'report/alarm', component: ReportAlarmComponent,  canActivate: [ AuthGuard ] },
      { path: 'alarm/history', component: AlarmMonitorHistoryComponent,  canActivate: [ AuthGuard ] },
      { path: 'alarm/custom', component: AlarmMonitorCustomComponent,  canActivate: [ AuthGuard ] },
      { path: 'multi/user/query', component: MultiUserQueryComponent,  canActivate: [ AuthGuard ] },
      { path: 'ahub', component: AhubConnInfoComponent,  canActivate: [ AuthGuard ] },
      { path: 'alarm/rule', component: AlarmRuleComponent,  canActivate: [ AuthGuard ] },
      { path: 'subscriber/config', component: SubscriberDataAnalyseConfigComponent ,  canActivate: [ AuthGuard ]},
      { path: 'subscriber/manage', component: SubscriberManageComponent ,  canActivate: [ AuthGuard ]},
      { path: 'subscriber/command/manage', component: SubscriberCommandManageComponent ,  canActivate: [ AuthGuard ]},
      { path: 'boss/monitor', component: BossMonitorComponent ,  canActivate: [ AuthGuard ]},
      { path: 'signaling/query', component: SignalingQueryRecordComponent , canActivate: [ AuthGuard]},
      { path: 'boss/statistic', component: BossStatisticComponent ,  canActivate: [ AuthGuard ]},
      { path: 'volte/alarm', component: VolteAlarmComponent ,  canActivate: [ AuthGuard ]},
      { path: 'volte/counter', component: VolteCounterComponent ,  canActivate: [ AuthGuard ]},
      { path: 'volte/message', component: VolteMessageComponent ,  canActivate: [ AuthGuard ]},
      { path: 'volte/report', component: VolteReportComponent ,  canActivate: [ AuthGuard ]},
      { path: 'ims/unitlog', component: ImsUnitLogComponent ,  canActivate: [ AuthGuard ]},
      { path: '**' , redirectTo: '/' }
    ]}
];
@NgModule({
  imports: [
    RouterModule.forChild( workspaceRoutes )
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class WorkspaceRoutingModule { }
