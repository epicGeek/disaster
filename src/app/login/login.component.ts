import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { InputTextModule, PasswordModule, CheckboxModule, ButtonModule } from 'primeng/primeng';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../core/config/config.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ices-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  todo: string;
  user = {username: '', password: '', rememberMe: '', isLdapUser: false };
  constructor(private authService: AuthService, private configService: ConfigService, private router: Router) { }

  // 登录时检查变量是否存在
  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['']);
    }
    localStorage.removeItem('currentMenuItem');
  }

  login() {
    this.configService.getAPIUrl().subscribe(
      urlData => {
        localStorage.setItem('apiConfig', JSON.stringify(urlData));

    this.authService.login(this.user).subscribe(
      data => {
        if (data.status === '0') {
          const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '';
          localStorage.setItem('token', data.token);
          localStorage.setItem('userMessage', data.role + '  ' + data.username);
          this.router.navigate(['/']).then(res => {
            this.authService.appendLogWithContent('/login', 'Login', '').subscribe(result => {});
          });
         } else {
          this.errorMessage = 'Incorrect username or password.';
          console.log(this.errorMessage);
         }
       },
      error => {
        this.errorMessage = 'Incorrect username or password.';
        this.todo = error.todo;
        console.log(this.errorMessage);
      });
      }
    );
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
