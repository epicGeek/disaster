import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'ices-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {


  constructor(private homeService: HomeService) {

  }

  menuModel = {};

  brotherMenu = [];

  ngOnInit() {
      this.menuModel = this.homeService.menuModel;
      // console.log(this.brotherMenu);
      this.brotherMenu = this.homeService.menuItemList;
  }

}
