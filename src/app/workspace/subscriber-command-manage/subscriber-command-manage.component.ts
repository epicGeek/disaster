import { Component, OnInit } from '@angular/core';
import {ConfirmationService} from 'primeng/primeng';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { AuthService} from '../../auth/auth.service';
import { SubscriberCommandManageService,SubscriberCommandManage } from './subscriber-command-manage.service';

@Component({
  selector: 'ices-subscriber-command-manage',
  templateUrl: './subscriber-command-manage.component.html',
  styleUrls: ['./subscriber-command-manage.component.css'],
  providers:[ConfirmationService]
})
export class SubscriberCommandManageComponent implements OnInit {

  constructor(private service:SubscriberCommandManageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,private authService:AuthService) { }

    itemList:SubscriberCommandManage[] = [];
  
    totalRecords : number = 0;
  
    params : string = "";
  
    editDisplay :boolean = false;
  
    categoryTypes = [];
  
    cmdTypes = [];
  
    columnCategory = {};
  
    columnCmd = {};
  
    checkItem:SubscriberCommandManage = {};
  
    types = [];
  
    msgs = [];
  
  
    editButton(item:SubscriberCommandManage){
      this.editDisplay = true;
      if(!item.category){
        item.category = this.categoryTypes.length ==0? '' : (this.categoryTypes[0].value || '');
      }
      this.checkItem = item;
      this.initForm(this.checkItem);
    }
  
    saveItem(values){
      this.checkItem.category = values['category'];
      this.checkItem.name = values['name'];
      this.checkItem.command = values['command'];
      this.checkItem.params = values['params'];
      this.checkItem.defaultParamValues = values['defaultParamValues'];
      this.checkItem.remarks = values['remarks'];
      let flag = this.checkItem['_links'] ? false : true;
      this.service.saveSubscriberCommand(this.checkItem).subscribe(result =>{
        this.editDisplay = false;
        this.showMessage('success', 'Done');
        this.initData();
        this.initForm({category: '', name: '', command: '', params: '', defaultParamValues: '', remarks: '', script: ''});
        this.authService.appendLogWithContent('/workspace/subscriberCommand', 'subscriberCommandManage', 'add or update check item:'+this.checkItem.name).subscribe(result => {}, error => { });
      });
    }
    removeItem(item) {
        this.confirmationService.confirm({
            message: 'confirm delete ?',
            accept: () => {
                this.service.removeCheckItem(item).subscribe(result => {
                    this.showMessage('info','Done');
                    this.authService.appendLogWithContent('/workspace/subscriberCommand', 'subscriberCommandManage', 'remove check item:'+item.name).subscribe(result => {}, error => { });
                    this.initData();
                });
            }
        });
    }
  
    categoryList = {};
  
    checkForm :FormGroup = this.fb.group({});
  
    ngOnInit() {
        this.service.findSubscriberCommandCategory().subscribe( result =>{
          result.forEach(event => {
              this.categoryList[event.subCommandCode] = event.subCommandName;
              this.categoryTypes.push({ label: event.subCommandName, value: event.subCommandCode });
          });
          this.initData();
        });
  
      this.initForm({category: '', name: '', command: '', params: '',defaultParamValues: '', remarks: ''});
  
    }
  
    initForm(check){
        this.checkForm = this.fb.group({
          'category': new  FormControl(check['category'], Validators.required),
          'name': new FormControl(check['name'], Validators.required),
          'command': new FormControl(check['command'], Validators.required),
          'params': new FormControl(check['params']),
          'defaultParamValues': new FormControl(check['defaultParamValues']),
          'remarks': new FormControl(check['remarks']),
        });
    }
  
    initData(){
      this.service.findSubscriberCommand().subscribe(result => {
          this.itemList = result.sort(this.compare('id'));
          this.totalRecords = result.length;
      })
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
  
    subscriberComandGroupDisplay : boolean = false;
  
    subscriberCommandgroupList = [];
  
    optionalList  = [];
  
    selectedList = [];
  
    selectedSubscriberCommandGroup = {};
  
    checkSubscriberCommandGroupClick(){
        this.subscriberComandGroupDisplay = true;
        this.service.findSubscriberCommandGroupList().subscribe(result =>{
            this.subscriberCommandgroupList = result;
        });
    }
  
    groupSelect(event){
        let groupModel = event.data;
        this.service.findSubscriberCommandGroupResource(groupModel.id).subscribe(result =>{
            this.optionalList  = [];
            this.selectedList  = [];
            let itemId;
            this.itemList.forEach(event => {
                  let flag = false;
                  result.forEach(element => {
                      flag = groupModel.id == element.groupId && event.itemId == element.subscriberCommandId ? true : flag;
                  });
                  (flag ? this.selectedList : this.optionalList).push(event);
            })
        });
    }
  
    saveResource(){
        if(this.selectedSubscriberCommandGroup['id']){
            let resource = [];
            this.selectedList.forEach(element =>{
                resource.push(element.itemId);
            });
            this.service.saveSubscriberCommandGroupResource({ group : this.selectedSubscriberCommandGroup['id'] , resource : resource.join(',')})
            .subscribe(result => {
                this.showMessage('info','SUCCESS');
            });
        }else{
            this.showMessage('info','no selected group');
        }
    }


}
