import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule  } from '@angular/forms';

import {DialogModule, InputTextModule, ButtonModule, GrowlModule , PasswordModule} from 'primeng/primeng';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileService } from './user-profile/user-profile.service';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from './config/config.service';

@NgModule({
  imports: [
    CommonModule, RouterModule, FormsModule,
    DialogModule, InputTextModule, ButtonModule, GrowlModule, PasswordModule
  ],
  exports: [ PageNotFoundComponent, UserProfileComponent ],
  declarations: [ PageNotFoundComponent, UserProfileComponent ],
  providers: [ LoggerService, UserProfileService, ConfigService ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
  static forRoot(): ModuleWithProviders {
   return {
    ngModule: CoreModule,
    providers: [

    ]
  };
  }
}
// to avoid reimporting this Module
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}

