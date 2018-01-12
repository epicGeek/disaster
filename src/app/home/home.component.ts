import { Component, ViewChildren, ContentChildren, AfterViewInit, AfterContentInit, OnInit, OnDestroy, QueryList } from '@angular/core';
import { EventEmitter, Output} from '@angular/core';
import { HomeService } from './home.service';
import { AuthService } from '../auth/auth.service';
import { HomeNavItem } from './model/home-nav-item';
import { HomeNavGroup } from './model/home-nav-group';
import { HomeNavGroupComponent } from './home-nav-group/home-nav-group.component';
import { HomeAlarmItem } from './model/home-alarm-item';
import { RequestCmd } from './model/request-cmd';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(HomeNavGroupComponent)
  private homeGroupComponentList: QueryList<HomeNavGroupComponent>;

  public messageQueue: Array<string> = [];

  private homeMenuItemList: HomeNavItem[];
  constructor(
    private homeService: HomeService,private router: Router,
  ) { }

  showCount: Boolean = false;
  // Timer
  // private timer: NodeJS.Timer;


  ngOnInit() {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    if (!apiConfig) {
      this.router.navigate(['logout']);
    }
    this.showCount = this.homeService.getShowCount();
  }
  onSendMsg = () => {
  }

  ngOnDestroy() {

  }

  homeMenuGroup() {
    const menuItems = JSON.parse(localStorage.getItem('homeMenuItemList'));
    if (menuItems) {
          const menuGroup = {};
          menuItems.forEach(menu => {
              // console.log(menu)
              if (menu) {
                  menuGroup[menu.groupName] = menuGroup[menu.groupName] == null ? [] : menuGroup[menu.groupName];
                  menuGroup[menu.groupName].push(menu);
              }
          });
          localStorage.setItem('menuGroup', JSON.stringify(menuGroup));
          // console.log(this.menuGroup);
    }
  }

  ngAfterViewInit() {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm');


    this.homeService.getHomeNavItemList().subscribe(
      data => {
        this.homeMenuItemList = data;
        localStorage.setItem('homeMenuItemList', JSON.stringify(data));
        this.homeMenuGroup();
        this.homeGroupComponentList.forEach((comp) => {
          const menuGroupName = comp.menuGroupName;
          const subMenuList = data.filter((itemData) => {
            return itemData.groupName === menuGroupName;
          });
         comp.addMenuItemList(subMenuList);
        });
      },
      error => console.log(error),
      () => {}
    );
  }
}
