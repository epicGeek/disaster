import { Component, OnInit } from '@angular/core';
import { NetWorkService, GsTableVo } from './net-work.service';
import { AuthService} from '../../../auth/auth.service';
@Component({
  selector: 'ices-net-work',
  templateUrl: './net-work.component.html',
  styleUrls: ['./net-work.component.css']
})
export class NetWorkComponent implements OnInit {

  constructor(private netWorkService:NetWorkService,private authService:AuthService) {
   }

  ngOnInit() {
    this.netWorkService.getColumnsData('/templet/network/cols').subscribe((result) => this.columns = result);
    this.netWorkService.getColumnsData('/templet/network/tables').subscribe((result) => this.tableList = result);
  }

  columns = [
      // { label : 'test' ,value :'test' }
  ];

  colNamesStr : string = '';
  dbNamesStr : string = '';
  tmpTable : GsTableVo = {};

  // colmunName : string = '';
  colmunName = {label:'',value:''};

  columnList = [
      // { label :'POOL',state:false },
      // { label :'NE',state:false }
  ];

  msgs = [];

  tableList = [
    // {tableId:1, data:[ {label:'附着用户数1',value:'kpi001'},{label:'附着用户数2',value:'kpi002'},{label:'附着用户数3',value:'kpi003'} ] },
    // {tableId:2, data:[ {label:'激活session数',value:'ses001'},{label:'PGW用户数',value:'usr001'},{label:'附着用户数3',value:'kpi003'} ] }
  ];

  templateArray = [];

  addItem(){
      if(this.colmunName.label==''){
        this.colmunName = this.columns[0].value;
      }
      this.columnList.push(this.colmunName);
  }

  removeItem(item){
      this.columnList.splice(this.columnList.indexOf(item),1);
  }

  addTable(){
      this.transColNamesStr();

      this.netWorkService.saveColumns(this.colNamesStr,this.dbNamesStr,this.tableId)
          .subscribe(result => {
            // this.tmpTable = result;
            this.authService.appendLogWithContent('/workspace/report/network', 'reportNetwork', 'add or update table:'+JSON.stringify(this.colNamesStr)).subscribe(result => {}, error => { });
            if(this.tabelItem){
                this.tabelItem.data = this.columnList;
            }else{
                this.tableList.push({tableId:result.tableId, data : this.columnList });
            }
            this.tableId = null;
            this.tabelItem = null;
            this.columnList = [];
            this.colNamesStr = '';
            this.dbNamesStr = '';
            this.showInfo('success','SUCCESS');
          });
  }

  transColNamesStr(){
    for(let i=0;i<this.columnList.length;i++){
      this.colNamesStr = this.colNamesStr + "," + this.columnList[i].label;
    }
    for(let i=0;i<this.columnList.length;i++){
      this.dbNamesStr = this.dbNamesStr + "," + this.columnList[i].value;
    }
  }

  showInfo(type,message) {
        this.msgs = [];
        this.msgs.push({severity:type, summary:'Message', detail:message});
  }

  tabelItem = null;
  tableId = null;

  editTable(item){
    console.log('editTable item.tableId:'+item.tableId);
      this.columnList = [];
      item.data.forEach(element => {
          this.columnList.push(element);
      });
      this.tabelItem = item;
      this.tableId = item.tableId;
  }

  removeTable(item){
    this.netWorkService.deleteTable(item.tableId)
        .subscribe(result => {
          if(result.stat=='success'){
            this.tableList.splice(this.tableList.indexOf(item),1);
            this.showInfo('success','SUCCESS');
          }
        });
  }

  saveTableOrder(){
    let tableOrderStr = '';
    this.tableList.forEach(table => {
      console.log('table.tableId:'+table.tableId);
      tableOrderStr += table.tableId + ',';
    });
    console.log('tableOrderStr:'+tableOrderStr);
    if ( tableOrderStr != '' ) {
      this.netWorkService.saveTableOrder(tableOrderStr)
        .subscribe(result => {
          if(result.stat=='success'){
            this.showInfo('success','SUCCESS');
          }
        });
    }
    else{
      this.showInfo('fail','please create tables first');
    }

  }

}
