import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild, CanLoad,
  Router, Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationExtras
} from '@angular/router';
import { AuthService } from './auth/auth.service';
import { TokenModel } from './auth/token-model';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  createTime: Date;

  constructor(private authService: AuthService, private router: Router) {
    this.createTime = new Date();
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    const url: string = state.url;
    // return this.checkLogin(url);
    const token = localStorage.getItem('token');
    const apiConfig = localStorage.getItem('apiConfig');
    if (!apiConfig) {
      this.router.navigate(['/login']);
    }
    if (!token) {
      this.router.navigate(['/login']);
    }
    const checkResult = this.activateCheck(url);
    if (!checkResult) {
      this.authService.redirectUrl = url;
      return false;
    }
    if (checkResult) {
      // return this.authService.checkToken(token).map(result => {
      //   if (!result) {
      //     this.router.navigate(['/login']);
      //   } else {
      //     this.authService.appendLog(url);
      //     return result;
      //   }
      // });
      if (url !== '/' && !localStorage.getItem('currentMenuItem')) {
          return false;
      }
      return this.authService.checkMenu(token).map(result => {
          if (!result) {
            localStorage.removeItem('currentMenuItem');
            this.router.navigate([localStorage.getItem('url')]);
            localStorage.removeItem('url');
          } else {
              this.authService.appendLog(url);
              return result;
          }
      });
    }
  }

  activateCheck(url): boolean {
    let flag = false;
    const menuItems = JSON.parse(localStorage.getItem('homeMenuItemList'));
    if (menuItems && menuItems.length > 0) {
          menuItems.forEach(menu => {
              if ( menu.linkAddress && (menu.linkAddress.indexOf(url) !== -1
                || url.indexOf(menu.linkAddress) !== -1)) {
                flag = true;
              }
          });
    }
    flag = url === '/' ? true : flag;
    return flag;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    // 本地验证
    // let result = this.authService.checkToken();
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.checkToken(token).subscribe(result => {
        if (!result) {
          localStorage.removeItem('token');
        }
        }, error => {
          // localStorage.clear();
          // this.router.navigate(['/login']);
        });
        const checkResult = this.activateCheck(url);
        if (checkResult) {
          this.authService.appendLog(url);
          return checkResult;
        } else {
          this.authService.redirectUrl = url;
          this.router.navigate(['/']);
          return false;
        }

    } else {
      return false;
    }
  }
}
