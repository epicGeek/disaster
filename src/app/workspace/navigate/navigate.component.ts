import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {HomeNavItem} from '../../home/model/home-nav-item';
import {AuthService} from '../../auth/auth.service';

@Component({selector: 'dhss-navigate', templateUrl: './navigate.component.html', styleUrls: ['./navigate.component.css']})
export class NavigateComponent implements OnInit {

  @Input()
  menuItem = {
    groupDisplayName: ''
  };

  @Input()
  brotherMenu: HomeNavItem[];

  token = localStorage.getItem('token');

  menuGroupClick(menuModel, flag) {
    if (menuModel) {
      this.groupMenuList(menuModel);
      this.renderCurrentMenu(menuModel.linkAddress);
      localStorage.setItem('currentMenuItem', JSON.stringify(menuModel));
      this
        .authService
        .appendLogWithContent(menuModel.linkAddress, menuModel.displayName, menuModel.displayName)
        .subscribe(result => {}, error => {});
      this
        .router
        .navigate([menuModel.linkAddress])
        .then(function (result) {});
    } else {
      this
        .router
        .navigate(['']);
    }
  }
  constructor(private router: Router, private authService: AuthService) {}
  private renderCurrentMenu(url) {
    if (this.brotherMenu) {
      this
        .brotherMenu
        .forEach(menu => {
          const currentURL = url;
          if (currentURL.indexOf(menu.linkAddress) !== -1) {
            menu.isActive = 'active';
          } else {
            menu.isActive = '';
          }
        });
    }
  }

  private groupMenuList(menuModel) {
    if (menuModel.menuName) {
      const homeMenuList = localStorage.getItem('homeMenuItemList');
      const brotherMenu = JSON.parse(homeMenuList)as HomeNavItem[];
      const menuList = [];
      brotherMenu.forEach(menu => {
        if (menu.groupName === menuModel.menuName) {
          menuList.push(menu);
        }
      });
      this.brotherMenu = menuList;
      this.menuItem = menuModel;
    }
  }

  ngOnInit() {
    if (!this.menuItem) {
      this.getMenuList();
    }
    this.groupMenuList(this.menuItem);
    this.renderCurrentMenu(this.router.url);
  }

  getMenuList() {
    const menuItemString = localStorage.getItem('currentMenuItem');
    const brotherMenuString = localStorage.getItem('currentBrotherMenuItem');
    this.brotherMenu = JSON.parse(brotherMenuString)as HomeNavItem[];
    this.menuItem = JSON.parse(menuItemString);
  }
}
