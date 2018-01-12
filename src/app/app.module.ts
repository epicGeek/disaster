import { NgModule, ErrorHandler} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy} from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
// import { AdminModule } from './admin/admin.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { LoginModule } from './login/login.module';
import { AuthService } from './auth/auth.service';
import { ConfigService } from './core/config/config.service';
import { AuthGuard } from './auth-guard';
import { requestOptionsProvider } from './default-request-options.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    console.log(error);
  }
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    HomeModule,
    HttpModule,
    // AdminModule,
    WorkspaceModule, BrowserAnimationsModule
  ],
  providers: [
    // { provide: Http, useClass: ExtendedHttpService },
    {provide: LocationStrategy, useClass: HashLocationStrategy },

    AuthGuard, AuthService, ConfigService,
    requestOptionsProvider
    // {provide: ErrorHandler, useClass: MyErrorHandler}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
