import { Component, OnInit ,Directive,Input} from '@angular/core';
import { HomeAlarmGroupService } from './home-alarm-group.service';
import { Router,RouterLink } from '@angular/router';
import { HomeService } from '../home.service';

@Component({
  selector: 'home-alarm-group',
  templateUrl: './home-alarm-group.component.html',
  styleUrls: ['./home-alarm-group.component.css']
})

export class HomeAlarmGroupComponent implements OnInit {
//   menuGroup = {};
  alarm = [];
  kpiList = [];
  menuItems = [];

  constructor(private alarmService:HomeAlarmGroupService,private router: Router,
              private homeService: HomeService) {
                //   this.ngOnInit();
               }






  ngOnInit() {
    this.alarmService.getCountAlarm().subscribe(result => { this.alarm = result; }, error => { console.log(error);});
    this.alarmService.getCountKpi().subscribe(result => { this.kpiList = result; }, error => { console.log(error);});

  }

  menuClick(url:string,params){
    // console.log(this.menuGroup);
      const menuGroup = JSON.parse(localStorage.getItem('menuGroup'));
      this.menuItems = JSON.parse(localStorage.getItem('homeMenuItemList'));
      if(this.menuItems && this.menuItems.length > 0){
            this.menuItems.forEach(menu =>{
                if(menu.linkAddress && menu.linkAddress.indexOf(url) != -1){
                    this.homeService.menuModel = menu;
                    localStorage.setItem('currentMenuItem',JSON.stringify(menu));

                    let menuItemList = menuGroup[menu.groupName];
                    this.homeService.menuItemList = menuItemList;
                    localStorage.setItem('currentBrotherMenuItem', JSON.stringify(menuItemList));
                    let link = [menu.linkAddress];
                    if(params){
                        link.push({code:params});
                    }
                    this.router.navigate(link);
                    // return false;
                }
            })
      }

  }

}
