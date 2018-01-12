import { Component, OnInit, HostListener
        //  ,ViewEncapsulation,trigger, transition, animate,style, state
         } from '@angular/core';
import { Router } from '@angular/router';

import { InputTextModule, PasswordModule, CheckboxModule, ButtonModule } from 'primeng/primeng';
import { AuthService } from '../auth/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ices-logout',
  templateUrl: 'logout.component.html',
  styleUrls: ['login.component.css']
})
export class LogOutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  // 登录时检查变量是否存在
  ngOnInit() {
      // localStorage.removeItem("token");
      localStorage.clear();
      this.authService.tokenModel = null;
  }
  relogin() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.relogin();
    }
  }
}
