import { Component, OnInit } from '@angular/core';
import { CheckItemService,CheckItem } from './check-item.service';
import {ConfirmationService} from 'primeng/primeng';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { AuthService} from '../../auth/auth.service';

@Component({
  selector: 'ices-check-item',
  templateUrl: './check-item.component.html',
  styleUrls: ['./check-item.component.css'],
  providers:[ConfirmationService]
})
export class CheckItemComponent implements OnInit {

  constructor(private service:CheckItemService,
              private confirmationService: ConfirmationService,
              private fb: FormBuilder,private authService:AuthService) { }

  itemList:CheckItem[] = [];

  totalRecords : number = 0;

  params: string = '';

  editDisplay: boolean = false;

  categoryTypes = [];

  cmdTypes = [];

  columnCategory = {};

  columnCmd = {};

  checkItem:CheckItem = {};

  types = [];

  msgs = [];

  applyUnit = [];

  testLuaLogDisplay: boolean = false;

  luaResult: String = '';

  luaTestResult = {};

  luaTestMessage = [];

  scriptTypeList = [];

//   uploadDisplay: boolean = false;

//   uploadUrl = this.service.getUploadUrl();



  editButton(item: CheckItem){
    this.editDisplay = true;
    if(!item.category){
      item.category = this.categoryTypes.length ==0? '' : (this.categoryTypes[0].value || '');
      item.cmdType = this.cmdTypes.length == 0 ? '' : (this.cmdTypes[0].value || '');
    }
    this.checkItem = item;
    this.checkItem.scriptType = this.checkItem.scriptType ? this.checkItem.scriptType : '1';
    this.initForm(this.checkItem);
  }

  saveItem(values) {
    this.checkItem.applyUnit = values['applyUnit'].join('/');
    this.checkItem.category = values['category'];
    this.checkItem.name = values['name'];
    this.checkItem.command = values['command'];
    this.checkItem.params = values['params'];
    this.checkItem.account = values['account'];
    this.checkItem.script = values['script'];
    this.checkItem.scriptType = values['scriptType'];
    this.checkItem.defaultParamValues = values['defaultParamValues'];
    let flag = this.checkItem['_links'] ? false : true;
    this.service.saveCheckItem(this.checkItem).subscribe(result =>{
      this.editDisplay = false;
      this.showMessage('success', 'Done');
      this.initData();
      this.initForm({category: '', name: '', command: '', params: '', account: '', applyUnit: '', script: '', luaLog: ''});
      this.authService.appendLogWithContent('/workspace/check/item', 'checkItemManage', 'add or update check item:'+this.checkItem.name).subscribe(result => {}, error => { });
    });
  }
  removeItemErrorDisplay = false;
  removeItem(item) {
      this.confirmationService.confirm({
          message: 'confirm delete ?',
          accept: () => {
              this.service.removeCheckItem(item).subscribe(result => {
                  this.showMessage('info','Done');
                  this.authService.appendLogWithContent('/workspace/check/item', 'checkItemManage', 'remove check item:'+item.name).subscribe(result => {}, error => { });
                  this.initData();
              },error=>{
                  this.removeItemErrorDisplay = true;
              });
          }
      });
  }

  categoryList = {};

  checkForm :FormGroup = this.fb.group({});

  ngOnInit() {
      this.service.findCategory().subscribe( result =>{
        result.forEach(event => {
            this.categoryList[event.typeCode] = event.typeName;
            this.categoryTypes.push({ label: event.typeName, value: event.typeCode });
        });
        this.initData();
      });
    this.initDorpDown();

    this.service.getScriptType().subscribe(result => {
        this.scriptTypeList = [];
        result.forEach(element => {
            this.scriptTypeList.push({ label : element['script_type_name'], value: element['script_type_id']});
        });
    });
    this.initForm({category: '', name: '', command: '', params: '', account: '', applyUnit: null, script: '', luaLog: ''});

  }

  initForm(check){
      this.checkForm = this.fb.group({
        'category': new  FormControl(check['category'], Validators.required),
        'name': new FormControl(check['name'], Validators.required),
        'command': new FormControl(check['command'], Validators.required),
        'params': new FormControl(check['params']),
        'defaultParamValues': new FormControl(check['defaultParamValues']),
        'account': new FormControl(check['account']),
        'applyUnit': new FormControl(check['applyUnit'] ? check['applyUnit'].split('/'):[], Validators.required),
        'script': new FormControl(check['script']),
        'scriptType': new FormControl(check['scriptType']),
        'luaLog': new FormControl(check['luaLog'])
      });
  }

  initData(){
    this.service.findCheckItem().subscribe(result => {
        this.itemList = result.sort(this.compare('itemId'));
        this.totalRecords = result.length;
    })
  }


  initDorpDown(){
      // this.service.findSubtoolType().subscribe(result =>{
      //   result.forEach(event =>{
      //       this.cmdTypes.push({ label:event.subtoolCmdTypeName,value:event.subtoolCmdTypeCode });
      //   })
      // })
    //   this.service.findCategory().subscribe( result =>{
    //     result.forEach(event => {
    //         this.columnCategory
    //         this.categoryTypes.push({ label:event.commandCategoryTypeName,value:event.commandCategoryTypeCode });
    //     });
    //   });
    //   this.service.findSubtoolType().subscribe(result =>{
    //     result.forEach(event =>{
    //         this.cmdTypes.push({ label:event.subtoolCmdTypeName,value:event.subtoolCmdTypeCode });
    //     })
    //   })
      this.service.getTypes()
      .subscribe( result => {
        let tmp = [];
        result.forEach(event =>{
            if(tmp.indexOf(event.unitType) == -1){
                this.types.push({ label : event.unitType , value : event.unitType });
                tmp.push(event.unitType);
            }
        })
      });
  }

  showMessage(type,detail) {
    this.msgs = [];
    this.msgs.push({severity:type, summary:'message', detail:detail});
  }

  compare(property){
    return function(a,b){
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
    }
  }

  itemGroupDisplay : boolean = false;

  groupList = [];

  optionalList  = [];

  selectedList = [];

  selectedGroup = {};

  checkItemGroupClick(){
      this.itemGroupDisplay = true;
      this.service.findGroupList().subscribe(result =>{
          this.groupList = result;
      });
  }

  groupSelect(event){
      let groupModel = event.data;
      this.service.findGroupResource(groupModel.id).subscribe(result =>{
          this.optionalList  = [];
          this.selectedList  = [];
          this.itemList.forEach(event => {
                let flag = false;
                result.forEach(element => {
                    flag = groupModel.id == element.groupId && event.itemId == element.checkItemId ? true : flag;
                });
                (flag ? this.selectedList : this.optionalList).push(event);
          })
      });
  }

  saveResource(){
      if(this.selectedGroup['id']){
          let resource = [];
          this.selectedList.forEach(element =>{
              resource.push(element.itemId);
          });
          this.service.saveGroupResource({ group : this.selectedGroup['id'] , resource : resource.join(',')})
          .subscribe(result => {
              this.showMessage('info','SUCCESS');
          });
      }else{
          this.showMessage('info','no selected group');
      }
  }


  testLua(item: CheckItem){
        if (item.script == null){
            this.showMessage('warn', 'script is null');
        }else{
            this.luaResult = '';
            this.testLuaLogDisplay = true;
        }
  }


  execLua(values){
    this.checkItem.luaLog = values['luaLog'];
    if(this.checkItem.luaLog==null){
        this.showMessage('warn', 'luaLog is null');
    }else{
        this.service.execLuaService(
            { script : this.checkItem['script'], luaLog: this.checkItem['luaLog'],
             scriptType: this.checkItem['scriptType']}).subscribe(result => {
              this.authService.appendLogWithContent('/workspace/check/item', 'checkItemManage', 'test lua')
              .subscribe( result1 => {}, error => { });
                // this.showMessage(result["resultCode"]==0?'info':'error', result["message"]);
                this.luaTestMessage = [];
                this.luaResult = result['message'] ? result['message'] : 'SUCCESS';
                this.showMessage(result['resultCode'] === '0' ? 'info' : 'error',
                result['resultCode'] === '0' ? 'success' : 'error');
                // this.luaTestMessage.push({severity:result["resultCode"]==0?'info':'error',
                // summary:'Info Message', detail:result["message"]});
            });
    }
  }


//   showImportTemplate() {
//     this.uploadDisplay = true;
//   }
  
//   afterUpload(event) {
//     this.msgs = [];
//     this.uploadDisplay = false;
//     this.initData();
//     let response = JSON.parse(event.xhr.response);//json string ->json obj
//     console.log(response);
//     this.msgs.push({severity:response.severity, summary:response.summary, detail:response.detail});
//   }



}
