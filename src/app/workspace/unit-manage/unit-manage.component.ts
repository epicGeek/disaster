import { Component, OnInit } from '@angular/core';
import { UnitManageService } from './unit-manage.service';
import {Validators,FormControl, FormGroup,FormBuilder} from '@angular/forms';
import { AuthService} from '../../auth/auth.service';
//import {FormBuilder,Validators,FormControl} from '@angular/forms';



@Component({
  selector: 'ices-unit-manage',
  templateUrl: './unit-manage.component.html',
  styleUrls: ['./unit-manage.component.css']
})
export class UnitManageComponent implements OnInit {
 // 查询条件属性
// private fb: FormBuilder
  constructor(private unitManageService:UnitManageService,private fb: FormBuilder,private authService:AuthService) {

   }

   // 查询条件属性
  paramStr : string = '';
  unitform = {};
  params:string ;

  unitList = [];

  // 选择单元弹框输入的条件
  inputUnitParam : string = '';

 // 网元基础数据
  neData = [];

  // 所有网元
  neList = [] ;

  // 登录协议
  protocol = [{label: 'TELNET', value: 'TELNET'},{label: 'SSH', value: 'SSH'}] ;

  queryNeType:string ='';

  queryNeName:string ='';

  queryUnitType:string ='';

  //所有类型
  TypeList = [];

  //网元类型
  neType = [];

  //单元类型
  unitType = [];

  msgs = [];

  editUnitDisplay : boolean = false;

  editUnitItem = {} as any;

  neTypeDropdown = [];

  unitTypeDropdown = [];

  totalRecords = 0 ;

  size : Number;
  page : Number;

  delteSelectItem = [];

  deleteUnitDisplay = false;

  dropdownData = null;

  editDropdownData = null;

  searchFilterData = {neType:[],ne:[],unitType:[]};

  editFilterData = {neType:[],ne:[],unitType:[]};

  getDropdownData(){
      this.unitManageService.getDropdownInfo()
      .subscribe(result => {
              this.dropdownData = result;
              this.editDropdownData = result;
              this.unitManageService.getNeList().subscribe(result => {
                  result.forEach(ne => {
                      this.neModelList[ne['id']] = ne;
                      this.editDropdownData['ne'].forEach(element => {
                          
                          element['value'] = (element['label'] == ne['ne_name'] ? ne['id'] : element['value'])
                      });
                  })
              });
              
              this.initDropData();
      });
  }

  initDropData(){
      this.searchFilterData['neType'] = this.allConcat('NE TYPE',this.dropdownData['neType']);
      this.searchFilterData['ne'] = this.allConcat('NE',this.dropdownData['ne']);
      this.searchFilterData['unitType'] = this.allConcat('UNIT TYPE',this.dropdownData['unitType']);
  }

  initEditDropData(){
    this.editFilterData['neType'] = this.allConcat('NE TYPE',this.dropdownData['neType']);
    this.editFilterData['ne'] = this.allConcat('NE',this.dropdownData['ne']);
    this.editFilterData['unitType'] = this.allConcat('UNIT TYPE',this.dropdownData['unitType']);
  }

  allConcat(type,list):any[]{
    return [{label:'ALL '+type,value:''}].concat(list);
  }

  filterUnitAndTypeQueryData() {
    this.onChangeDropdown(this.dropdownData['ne'],'ne',{neType:this.queryNeType},'NE',this.searchFilterData);
    this.onChangeDropdown(this.dropdownData['unitType'],'unitType',{neType:this.queryNeType},'UNIT TYPE',this.searchFilterData);
  }

  filterUnitAndTypeData(checkForm) {
    // console.log(checkForm);
    this.onChangeDropdown(this.editDropdownData['ne'],'ne',{neType:checkForm['value']['neType']},'NE',this.editFilterData);
    this.onChangeDropdown(this.editDropdownData['unitType'],'unitType',{neType:checkForm['value']['neType']},'UNIT TYPE',this.editFilterData);
  }

  onChangeDropdown(allData, dropdownName, params,labelName,dropdownData) {
    dropdownData[dropdownName] = [{label:'ALL '+labelName,value:''}];
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
            dropdownData[dropdownName].push(element);
        }
    });
  }
//,private fb: FormBuilder


  ngOnInit() {
      this.initForm({neType:'',neId:'',unitType:'',unitName:'',unitDesc:'',coDn:'',coGid:'',unitSwVersion:'',unitIdsVersion:'',physicalLocation:'',serverIp:'',serverPort:'',serverProtocol:'',loginName:'',loginPassword:'',rootPassword:'',isForbidden:''});
      this.size = 20;
      // this.initTypeList();
      this.getDropdownData();
      
  }



   query() {
    this.getUnitData({
      first : 0,
      rows : this.size
    });
  }

  exportUnit() {
      let item = {
            queryNeType: this.queryNeType,
            queryNeName: this.queryNeName,
            queryUnitType: this.queryUnitType,
            paramStr: this.paramStr
      };

      this.unitManageService.exportUnit(item);
  }

  getUnitData(event) {
      this.page = event.first / event.rows;
      this.size = event.rows;
       let item = {
            page: this.page,
            size: this.size,
            queryNeType: this.queryNeType,
            queryNeName: this.queryNeName,
            queryUnitType: this.queryUnitType,
            paramStr: this.paramStr
      };
      this.unitManageService.findData(item).subscribe(result => {
          this.unitList = result['content'] || [];
          this.totalRecords = result['totalElements'];
      });
  }

  refushUnitData() {
       let item = {
            page: this.page,
            size: this.size,
            queryNeType: this.queryNeType,
            queryNeName: this.queryNeName,
            queryUnitType: this.queryUnitType,
            paramStr: this.paramStr
      };
      this.unitManageService.findData(item).subscribe(result => {
          this.unitList = result['content'] || [];
          this.totalRecords = result['totalElements'];
      });
  }
  saveOrEditItem(values){
    let array = Object.keys(values);
     array.forEach(key => {
         this.editUnitItem[key] = values[key];
     })
    // this.editUnitItem['neId'] = this.editUnitItem['ne']['id'];
    this.editUnitItem['neName'] = this.neModelList[this.editUnitItem['neId']]['ne_name'];
    this.editUnitItem['neSite'] = this.neModelList[this.editUnitItem['neId']]['physical_location'];
    this.editUnitItem['id'] = this.saveOrEdit ? null : this.editUnitItem['id'];
    this.editUnitItem['dhssName'] = this.neModelList[this.editUnitItem['neId']]['dhss_name'];
    // console.log(this.editUnitItem);
    this.unitManageService.saveOrEditEquipmentUnit(this.editUnitItem).subscribe(result => {
          if(result){
             this.saveOrEdit = false;
             this.saveUnitDisplay = false;
             this.msgs = [];
             this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'Done'});
             this.refushUnitData();
             this.editUnitDisplay = false;
          }else{
            this.msgs.push({severity: 'error', summary: 'Info Message', detail: 'error'});
          }

    }, error => {
        this.msgs.push({severity: 'error', summary: 'Info Message', detail: 'error'});
    });
    this.authService.appendLogWithContent('', 'unitManage', 'add or update unit:'+this.editUnitItem['unitName']).subscribe(result => {}, error => { });
  }

  // 删除按钮时间
  deleteItem(item){
    this.delteSelectItem = [];
    this.delteSelectItem = item;
    this.deleteUnitDisplay = true;
  }

  removeUnit(){
     this.unitManageService.removeData(this.delteSelectItem).subscribe(result =>{
         this.deleteUnitDisplay = false;
         this.refushUnitData();
         this.msgs = [];
         this.msgs.push({severity: 'info', summary: 'Info Message', detail:'Done'});
         this.unitList.splice(this.unitList.indexOf(this.delteSelectItem),1);
     });
     this.authService.appendLogWithContent('', 'unitManage', 'remove unit:'+this.delteSelectItem['unitName']).subscribe(result => {}, error => { });
  }

  showSaveUnitButton = false;

  checkFormValues = null;

  saveOrEdit = false;

  saveUnitDisplay = false;

  saveItemClick(checkForm){
    this.checkFormValues = checkForm;
    this.saveOrEdit = true;
    this.saveUnitDisplay = true;
  }

  saveItem(){
    //   console.log(this.checkFormValues);
      this.saveOrEditItem(this.checkFormValues);
  }

  editUnit(item){
      this.showSaveUnitButton = true;
      this.initEditDropData();
      this.editUnitItem = item;
      this.initForm(this.editUnitItem);
      this.editUnitDisplay = true;
      this.filterUnitAndTypeData(this.checkForm);
      // this.unitManageService.getNeList().subscribe(result => {
      //          this.neData = result;
      //          this.unitManageService.getTypes().subscribe(result => {
      //                   this.TypeList = result;
      //                   this.editUnitItem = item;
      //                    this.initForm(this.editUnitItem);
      //                   this.editUnitDisplay = true;
      //                   this.fillTypes();
      //          });
      // });

  }

  neModelList = {};



  

  

  resetQuery() {

    this.initDropData();
    // this.initTypeList();
    this.queryNeName = '';
    this.queryNeType = '';
    this.queryUnitType = '';
    this.paramStr = '';
    this.refushUnitData();
  }

  // 增加按钮事件
  addUnit() {
    this.showSaveUnitButton = false;
    this.initEditDropData();
    this.editUnitItem = {serverProtocol: 'SSH', isForbidden: false};
    this.editUnitDisplay = true;
    this.initForm(this.editUnitItem);
  }

  checkForm :FormGroup = this.fb.group({});
  initForm(check) {
      this.checkForm = this.fb.group({
        'neType': new  FormControl(check['neType'], Validators.required),
        'neId': new FormControl(check['neId'], Validators.required),
        'unitType': new FormControl(check['unitType'], Validators.required),
        'unitName': new FormControl(check['unitName'], Validators.required),
        'unitDesc': new FormControl(check['unitDesc']),
        'coDn': new FormControl(check['coDn']),
        'coGid': new FormControl(check['coGid']),
        'unitSwVersion': new FormControl(check['unitSwVersion']),
        'unitIdsVersion': new FormControl(check['unitIdsVersion']),
        'physicalLocation': new FormControl(check['physicalLocation']),
        'serverIp': new FormControl(check['serverIp'], Validators.required),
        'serverPort': new FormControl(check['serverPort'], Validators.required),
        'serverProtocol': new FormControl(check['serverProtocol'], Validators.required),
        'loginName': new FormControl(check['loginName'], Validators.required),
        'loginPassword': new FormControl(check['loginPassword'], Validators.required),
        'rootPassword': new FormControl(check['rootPassword'], Validators.required),
        'isForbidden': new FormControl(check['isForbidden'], Validators.required)
      });
      // this.filterUnitAndTypeData(this.checkForm);
  }
}
