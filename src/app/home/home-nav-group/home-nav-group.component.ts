import { Component, OnInit , Input} from '@angular/core';
import { HomeNavItem } from '../model/home-nav-item';
import { HomeService } from '../home.service';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'home-nav-group',
  templateUrl: './home-nav-group.component.html',
  styleUrls: ['./home-nav-group.component.css']
})
export class HomeNavGroupComponent implements OnInit {
  @Input()
  menuGroupName: string;
  @Input()
  menuGroupDisplayName: string;
  @Input()
  menuItems: HomeNavItem[];

  token = localStorage.getItem('token');


  constructor(private homeService: HomeService , private authService: AuthService , private router: Router) {

  }
  ngOnInit() {}
  addMenuItemList(menuItems: HomeNavItem[]) {
    this.menuItems = menuItems;
    this.menuItems.forEach(item => {
        this.menuGroupDisplayName = item.groupDisplayName;
    })
  }
  addMenuItem(menuItem: HomeNavItem) {
    this.menuItems.push(menuItem);
  }
  menuClick(menu) {
    this.homeService.menuModel = menu;
    localStorage.setItem('currentMenuItem', JSON.stringify(menu));
    this.homeService.menuItemList = this.menuItems;
    localStorage.setItem('currentBrotherMenuItem', JSON.stringify(this.menuItems));
    this.router.navigate([menu.linkAddress]).then(function (result) {
    }).catch(function (error) {
        console.log(error);
    });
    this.authService.appendLogWithContent(
    menu.linkAddress, menu.displayName, menu.displayName)
    .subscribe(result => { }, error => { });
  }
}
