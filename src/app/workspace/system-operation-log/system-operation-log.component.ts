import { Component, OnInit } from '@angular/core';
import { SystemOperationLogService } from './system-operation-log.service';
import * as moment from 'moment';
@Component({
  selector: 'ices-system-operation-log',
  templateUrl: './system-operation-log.component.html',
  styleUrls: ['./system-operation-log.component.css']
})
export class SystemOperationLogComponent implements OnInit {

  constructor(private systemOperationLogService:SystemOperationLogService) { 
    
  }

  systemOperationLogArray = [];

  ngOnInit() {
     
    this.startDate =  new Date(new Date().getTime()-(1000*60*60*24));
    this.endDate = new Date();
    this.userName = '';
    this.query();
  }
  startDate : Date;
  endDate : Date ;
  userName : String ;
  totalRecords : Number ;


    reset(){
    this.startDate =  new Date(new Date().getTime()-(1000*60*60*24));
    this.endDate = new Date();
    this.userName = '';
    
  }
  query(){
    let searchParam = {
      token:localStorage.getItem("token"),
      starTime:moment(this.startDate).format('YYYY-MM-DD HH:mm:ss'),
      endTime:moment(this.endDate).format('YYYY-MM-DD HH:mm:ss'),
      username:this.userName
    }
    console.log(searchParam);
    this.systemOperationLogService.querySystemOperationLogFromRemote(searchParam)
    .subscribe(resultData =>{
      this.systemOperationLogArray = resultData;
      this.totalRecords = resultData.length;
    });
  }
}
