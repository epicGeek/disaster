import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeNavGroupComponent } from './home-nav-group/home-nav-group.component';
import { HomeAlarmGroupComponent } from './home-alarm-group/home-alarm-group.component';

import { HomeService } from './home.service';
import { ButtonModule } from 'primeng/primeng';

import { HomeAlarmGroupService } from './home-alarm-group/home-alarm-group.service';

@NgModule({
  imports: [
    CommonModule, ButtonModule, RouterModule
  ],
  exports: [  ],
  declarations: [ HomeComponent, HomeNavGroupComponent, HomeAlarmGroupComponent ],
  providers: [
    HomeService, HomeAlarmGroupService
  ]
})
export class HomeModule {

}
