import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LogOutComponent } from './logout.component';

import { InputTextModule, PasswordModule, CheckboxModule, ButtonModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule, LoginRoutingModule, InputTextModule, PasswordModule, CheckboxModule, ButtonModule, FormsModule
  ],
  declarations: [ LoginComponent , LogOutComponent],
  exports: [ LoginComponent , LogOutComponent ]
})
export class LoginModule { }
