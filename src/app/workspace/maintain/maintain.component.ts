import { Component, OnInit ,OnDestroy  } from '@angular/core';
import { ActivatedRoute,Params,Router } from '@angular/router';
import { MaintainService } from './maintain.service';
import { MaintainOperation } from './MaintainOperation';
import { MaintainResult } from './MaintainResult';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AuthService} from '../../auth/auth.service';
import { NavigateService } from '../navigate/navigate.service';

import * as moment from 'moment';
@Component({
  selector: 'ices-maintain',
  templateUrl: './maintain.component.html',
  styleUrls: ['./maintain.component.css']
})
export class MaintainComponent implements OnInit,OnDestroy {
  constructor(private route:ActivatedRoute,
              private maintainService:MaintainService,
              private router:Router,
              private navigateService:NavigateService,private authService:AuthService
              ) {

              }
  bodyHeight = document.body.scrollHeight;

  dropdownData = null;

  ngOnDestroy() {
    this.time = window.clearInterval(this.time);
  }

  ngOnInit() {

    // this.typeList();

    // this.neListFunction();


    this.maintainService.findDropdown()
    .subscribe( result => { 
        this.dropdownData = result;
        this.dropdownModel.neTypes = this.allConcat('',result.neType);
        this.dropdownModel.unitTypes = this.allConcat('',result.unitType);
        this.dropdownModel.neNames = this.allConcat('',result.ne);
    })

    this.route.params
    .switchMap((params: Params) =>  this.test(params['filter']) )
    .subscribe( data => {
        console.log(data);
        this.time = window.clearInterval(this.time);
        this.sendTime();
     });
     this.time = window.clearInterval(this.time);
     this.sendTime();
  }

  msgs = [];

  filterParam:string;

  selectUnits = [];

  selectItems = [];

  unitList = [];

  commandCheckItemList = [];

  resultList = [];

  submitUnitItem = [];

  totalRecords = 0;

  submitDisplay : boolean = false;

  inputDisplay : boolean = false;

  inputCheckedAllReplace : boolean = false;

  inputItem = null;

  inputItemParam  = [];

  resultPage : number = 0;

  resultSize : number = 15;

  //执行单元个数
  execUnitNum : number = 0;

  //执行指令个数
  execItemNum : number = 0;

  dropdownModel = { 
    neTypes:[],
    unitTypes:[],
    neNames:[]
  };

  neTypeParam = '';

  changeDropdown(param){
        if(param == 'neType'){
            this.onChangeDropdown(this.dropdownData.unitType,'unitTypes',
            {neType:this.neTypeParam},'');
            this.onChangeDropdown(this.dropdownData.ne,'neNames',
            {neType:this.neTypeParam},'');
        }
  }

  onChangeDropdown(allData, dropdownName, params,labelName) {
    this.dropdownModel[dropdownName] =  [{label:'ALL',value:null}];
    allData.forEach(element => {
        let isNullFlag = true;
        let flag = true;
        let keys = Object.keys(params);
        keys.forEach(param=>{
            if(params[param] != null && params[param] != ''){
                flag = element[param] != params[param] ? false : flag;
                isNullFlag = false;
            }
        });
        
        if(isNullFlag || flag){
            this.dropdownModel[dropdownName].push(element);
        }
    });
  }

  allConcat(type,list):any[]{
      return [{label:'ALL '+type,value:''}].concat(list);
  }


  // neTypeList = [];

  // neList = [];

  // unitTypeList = [];

  // neListFunction(){
  //   this.maintainService.getNeList().subscribe(data => {
  //       this.neList = [];
  //       this.neList.push( { label : "ALL" ,value : "" , neType : ""} );
  //       data.forEach( element => {
  //         this.neList.push( { label : element.ne_name ,value : element.ne_name , neType : element.ne_type } );
  //       })
  //   })
  // }

  // typeList(){
  //   this.maintainService.getTypes().subscribe(data => {
  //       this.neTypeList = [];
  //       this.unitTypeList = [];
  //       this.neTypeList.push({ label : "ALL" , value : "" });
  //       this.unitTypeList.push({ label : "ALL" , value : "" , neType : "" });
  //       let netemp = [];
  //       let unittemp = [];
  //       data.forEach( element => {
  //         let neType = { label : element.neType , value : element.neType };
  //         let unitType = { label : element.unitType , value : element.unitType , neType : element.neType};
  //         if(netemp.indexOf(element.neType) == -1){
  //           this.neTypeList.push(neType);
  //         }
  //         if(unittemp.indexOf(element.unitType) == -1){
  //           this.unitTypeList.push(unitType);
  //         }
  //         netemp.push(element.neType);
  //         unittemp.push(element.unitType);
  //       })
  //   });
  // }

  //执行指令
  sendCmd(){
    let currDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    let userName = localStorage.getItem('userMessage');
    let maintainOperation = { id : 0,createBy : userName , commandCategory : this.filterParam,isDone : false ,requestTime : currDate , unitCount : this.execUnitNum,itemCount : this.execItemNum};
    this.showInfo({severity:'info', summary:'Message', detail:'Sending instructions, please wait！'});
    this.maintainService.addMaintainOperation(maintainOperation)
    .subscribe( operation => {
        operation.id = operation.operationId;
        this.maintainService.sendCmd(this.submitUnitItem,operation).subscribe( result => {
            this.submitDisplay = false;
            this.resultPage = 0;
            this.getMaintainOperationList();
            this.showInfo({severity:'info', summary:'Message', detail:'SUCCESS'});
            this.time = window.clearInterval(this.time);
            this.sendTime();
            this.authService.appendLogWithContent('workspace/maintain', 'maintain', 'send exec item '+ this.submitUnitItem.length).subscribe(result => {}, error => { });
        })
    })

  }

  time;

  sendTime(){
      this.time = setInterval(()=> {
          let flag = true;
          this.resultList.forEach(element => {
              if(!element.isDone){
                  flag = false;
              }
          });
          if(!flag){
              this.getMaintainOperationList();
              if(this.resultDisplay){
                  this.findResult()
              }
          }

          // if(flag){
          //     this.time = window.clearInterval(this.time);
          // }
      }, 1000);
  }

  //输入参数按钮事件
  inputParamClick(item){
    this.inputDisplay = true;
    this.inputItem = item;
    this.inputItemParam  = [];
    let array :any[]= this.inputItem.params.split(",");
    array.forEach(element => {
      this.inputItemParam.push({ name : element , value : "" });
    });
    this.inputCheckedAllReplace = false;
  }

  //设置参数按钮事件
  editParam(){
    let inputParam = [];
    this.inputItemParam.forEach(element => {
       inputParam.push(element.value);
    });
    if(this.inputCheckedAllReplace){
      this.submitUnitItem.forEach(element => {
        if(element.id == this.inputItem.id){
          element.defaultParam = inputParam.join(",");
        }
      })
    }
    this.inputItem.defaultParam = inputParam.join(",");
    this.inputDisplay = false;
  }

    //填充要执行的指令和单元列表
  submitExec(){
    if(this.selectUnits.length == 0){
      this.showInfo({severity:'info', summary:'Message', detail:'Please Select Unit'});
    }else if(this.selectItems.length == 0){
      this.showInfo({severity:'info', summary:'Message', detail:'Please Select CheckItem'});
    }else{
      //计算有多少单元
      let units = [];
      //计算有多少指令
      let items = [];
      this.submitUnitItem = [];
      this.selectUnits.forEach(unit => {
        this.selectItems.forEach(item => {
          if(item.applyUnit && ('/'+item.applyUnit+'/').indexOf('/'+unit.unitType+'/') != -1){
            this.submitUnitItem.push({unitName:unit.unitName,checkItemName:item.name,command:item.command,
            params:item.params,defaultParam:item.defaultParamValues,id : item.itemId});
            if(units.indexOf(unit.unitName) == -1) units.push(unit.unitName);
            if(items.indexOf(item.name) == -1) items.push(item.name);
          }
        })
      })
      this.execItemNum = items.length;
      this.execUnitNum = units.length;
      this.submitDisplay = true;
    }
  }

  clearDate(){
      this.resultStartFilterDate = null;
      this.resultEndFilterDate = null;
      this.getMaintainOperationList();
  }

  resultListLazy(event){
    this.resultPage = event.first/event.rows;
    this.resultSize = event.rows;
    this.getMaintainOperationList();
    this.time = window.clearInterval(this.time);
    this.sendTime();
  }
  flag = true;
  getMaintainOperationList(){
    let start = this.resultStartFilterDate ? moment(this.resultStartFilterDate).format('YYYY-MM-DD HH:mm:ss') : '';
    let end = this.resultEndFilterDate ? moment(this.resultEndFilterDate).format('YYYY-MM-DD HH:mm:ss') : '';
    this.maintainService
    .getMaintainOperationList(start,end,this.filterParam,this.resultPage,this.resultSize)
    .subscribe(result => {
      this.resultList = result.content;
      this.totalRecords = result.totalElements;
    })
  }

  showInfo(message) {
        this.msgs = [];
        this.msgs.push(message);
  }


  test(text):Observable<boolean>{
          this.filterParam = text;
          this.maintainService.getUnitList()
          .subscribe( result => { this.unitList = result['content'];  });


          this.maintainService.getCommandCheckItemList(this.filterParam)
          .subscribe( result => {  this.commandCheckItemList = result; });


          this.resultPage = 0;
          this.getMaintainOperationList();
          return Observable.of(true);
  }

  //查看详细结果弹窗

  resultStartFilterDate: Date;

  resultEndFilterDate: Date;

  resultDisplay : boolean = false;

  selectOperation = {};



  operationResultList : MaintainResult[] = [];


  resultDisplayTrue(item){
    this.logContent = [];
    this.logUnitName = [];
    this.selectOperation = item;
    this.findResult();
    this.selectedResult = [];
    this.resultDisplay = true;
  }

  findResult(){
      this.maintainService.getMaintainResultList(this.selectOperation)
      .subscribe(result => {
        result = result.sort(this.compare('unitName'));
        this.operationResultList = result;
      });
  }

  compare(property){
    return (a,b)=>{
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
    }
  }

  logContent  = [];
  logUnitName = [];

  logMessage = "";

  execState : boolean = true;

  onRowSelect(event){
    let dataPath = event.data.reportPath;
    this.execState = dataPath ? true : false;
    if(this.execState){
        let uuId = event.data.uuId;
        if(this.logUnitName.indexOf(uuId) == -1 ){
          this.maintainService.readAllLog(dataPath,event.data.unitName).subscribe( result => {
            let str =  result['content'];
            this.logContent.push(str);
            this.logUnitName.push(uuId);
            this.logMessage = str;
          })
        }else{
          this.logMessage = this.logContent[this.logUnitName.indexOf(uuId)];
        }
    }else{
        this.logMessage = event.data.errorLog;
    }
  }

  selectedResult = [];

  execDown(){
    console.log(this.selectedResult);
    if(this.selectedResult.length == 0 ){
      this.showInfo({severity:'info', summary:'Message', detail:'selected result！'});
    }else{
        let uuids:any[] = [];
        this.selectedResult.forEach(element => {
            uuids.push(element.uuId);
        });
        this.maintainService.getDownLogByuuid(uuids.join(','));
    }
  }

  downloadLog(item){
      this.maintainService.getDownLog(item.id);
      this.authService.appendLogWithContent('workspace/maintain', 'maintain', 'downloadLog id:'+ item.id).subscribe(result => {}, error => { });
  }

}
