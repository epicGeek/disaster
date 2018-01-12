import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigateComponent } from './navigate.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ NavigateComponent ],
  exports: [ NavigateComponent ],
  providers:[  ]
})
export class NavigateModule {  }
