import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'ices-smart',
  templateUrl: './smart-home.component.html',
  styleUrls: ['./smart-home.component.css']
})
export class SmartHomeComponent implements OnInit,OnDestroy {

  constructor() { }

  ngOnInit() {
    // this.navigateService.showNavigateBar = false;
  }
  ngOnDestroy(){
    // this.navigateService.showNavigateBar = true;
  }

}
