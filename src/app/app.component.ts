import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { HomeService } from './home/home.service';
import { AuthService } from './auth/auth.service';
import { ConfigService } from './core/config/config.service';

import { AuthGuard } from './auth-guard';
import { TokenModel } from './auth/token-model';
import { APIConfig } from './auth/api.config';

import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'ices-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showUserProfile: boolean;
  private apiConfig: APIConfig;
  constructor(private homeService: HomeService,
           private authService: AuthService,

    private configService: ConfigService,
              private route: ActivatedRoute,
              private router: Router,
              private authGuard: AuthGuard ) {

  }
  closeUserProfile(hideUserProfile: boolean) {
    this.showUserProfile = hideUserProfile;
  }
  activate(view: Component) {
    const currentURL = (this.router.url);
    if (currentURL !== '/logout' && currentURL !== '/login') {
      this.showUserProfile = true;
    } else {
      this.showUserProfile = false;
    }
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      this.showUserProfile = false;
    } else {
      this.showUserProfile = true;
    }
    // setInterval(param => {
    //   this.token = localStorage.getItem('token');
    //   // const checkToken = localStorage.getItem('checkToken');
    //   const apiConfig = localStorage.getItem('apiConfig');
    //   if (!this.token && this.router.url !== '/login') {
    //     alert('app');

    //     localStorage.clear();
    //     this.router.navigate(['/login']);
    //   }
    // }, 500);
  }
}
