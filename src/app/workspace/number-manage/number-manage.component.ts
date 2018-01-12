import { Component, OnInit } from '@angular/core';
import { NumberManageService, NumberSection } from './number-manage.service';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'ices-number-manage',
  templateUrl: './number-manage.component.html',
  styleUrls: ['./number-manage.component.css']
})
export class NumberManageComponent implements OnInit {

  constructor(private numberManageService: NumberManageService, private fb: FormBuilder) { }
  // 查询条件属性
  paramStr: String = '';
  params: string ;
  size: Number;
  page: Number;
  totalRecords: Number = 0;
  editNumberDisplay: Boolean = false;
  numberList = [];
  editNumberItem = {} as any;
  msgs = [];
  numberGroupDisplay: Boolean = false;

  groupList: NumberSection[] = [];

  optionalList  = [];

  selectedList = [];

  selectedGroup = {} as any;



  numberNeDisplay: Boolean = false;

  neList: NumberSection[] = [];

  neoptionalList  = [];

  neselectedList = [];

  selectedNe = {} as any;

  deleteNumberDisplay: Boolean = false;

  delteSelectItem = [];


  ngOnInit() {
        this.initForm({imsi: '', msisdn: ''});
  }

    getNumberData(event) {
      this.page = event.first / event.rows;
      this.size = event.rows;
       const item = {
            page: this.page,
            size: this.size,
            paramStr: this.paramStr
      };


      this.numberManageService.findData(item).subscribe(result => {
          this.numberList = result['content'] || [];
          this.totalRecords = result['totalElements'];
      });
  }

  refushNumberData() {
       const item = {
            page: this.page,
            size: this.size,
            paramStr: this.paramStr
      };
      this.numberManageService.findData(item).subscribe(result => {
          this.numberList = result['content'] || [];
          this.totalRecords = result['totalElements'];
      });
  }

   query() {
    this.getNumberData({
      first : 0,
      rows : this.size
    });
  }

  resetQuery() {
    this.paramStr = '';
    this.query();
  }

  // 增加按钮事件
  addNumber() {
     this.editNumberItem = {};
     this.initForm({imsi: '', msisdn: ''});
     this.editNumberDisplay = true;
  }

  saveOrEditNumber(values) {
     const array = Object.keys(values);
     array.forEach(key => {
         this.editNumberItem[key] = values[key];
     });
    //  this.editNumberItem['number'] = values['number'];
    //  this.editNumberItem['imsi'] = values['imsi'];
     this.numberManageService.saveOrEditNumberSection(this.editNumberItem).subscribe(result => {
          if (result) {
             this.msgs = [];
             this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'Done'});
             this.refushNumberData();
             this.editNumberDisplay = false;
          }else {
             this.msgs = [];
             this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'Failed'});
             this.refushNumberData();
          }

    });
  }

   editNumber(item) {

     this.editNumberItem = {};
     this.editNumberItem = item;
     this.initForm(this.editNumberItem);
     this.editNumberDisplay = true;
  }

  // 删除按钮时间
  deleteNumber(item) {
    this.delteSelectItem = [];
    this.delteSelectItem = item;
    this.deleteNumberDisplay = true;
  }

   removeNumber() {
     this.numberManageService.removeData(this.delteSelectItem).subscribe(result => {
         this.deleteNumberDisplay = false;
         this.refushNumberData();
         this.msgs = [];
         this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'Done'});
         this.numberList.splice(this.numberList.indexOf(this.delteSelectItem), 1);
     });
  }




   neSelect(event) {

      this.numberManageService.findSelectNeNumberResource(event.data.id).subscribe(result => {
            this.neoptionalList  = [];
            this.neselectedList  = [];
            this.numberManageService.findDataAll().subscribe(resultNum => {
                resultNum.forEach(item => {
                    if (result.indexOf(item.id) === -1) {
                        this.neoptionalList.push(item);
                    }else {
                        this.neselectedList.push(item);
                    }
                });
            });
      });
   }
   saveNeResource() {
       this.msgs = [];
       const resource = [];
       this.neselectedList.forEach(element => {
           resource.push({neId : this.selectedNe['id'] , numberId : element.id });
       });
       const postData = { neGroupResult: resource, selId: this.selectedNe['id'] };
       this.numberManageService.saveNeResource(postData).subscribe(result => {
           this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'Done'});
       });
   }


   numberNeClick() {
      this.neoptionalList  = [];
      this.neselectedList  = [];
      this.numberNeDisplay = true;
      this.numberManageService.findNeList().subscribe(result => {
          this.neList = result;
      });
  }

   numberGroupClick() {
      this.numberGroupDisplay = true;
      this.numberManageService.findGroupList().subscribe(result => {
          this.groupList = result;
      });
  }

   groupSelect(event) {

    this.numberManageService.findNumberListInGroup(event.data.id).subscribe(result => {
        this.optionalList = [];
        this.selectedList = [];
        this.numberManageService.findDataAll().subscribe(resultNum => {
            resultNum.forEach(item => {
                if (result.indexOf(item.id) === -1) {
                    this.optionalList.push(item);
                }else {
                    this.selectedList.push(item);
                }
            });
        });
    });

   }
   saveResource() {
        this.msgs = [];
        const resource = [];
        this.selectedList.forEach(element => {
            resource.push({groupId : this.selectedGroup['id'], numberId : element['id']});
        });
        const postData = { list: resource, selId: this.selectedGroup['id'] };
        this.numberManageService.saveGroupResource(postData).subscribe(result => {
            this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'Done'});
        });
   }

  // tslint:disable-next-line:member-ordering
  checkForm: FormGroup = this.fb.group({});

  initForm(check) {
      this.checkForm = this.fb.group({
        'msisdn': new  FormControl(check['msisdn'], Validators.required),
        'imsi': new FormControl(check['imsi'], Validators.required)
      });
  }
}
