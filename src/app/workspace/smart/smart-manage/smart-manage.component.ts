import { Component, OnInit } from '@angular/core';
import { SmartManageService } from './smart-manage.service';
import { SmartCheckJob } from '../smart-model/smart-check-job';
import { EquipmentNe } from '../smart-model/equipment-ne';
import { Message } from 'primeng/primeng';
import { AuthService } from '../../../auth/auth.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'ices-smart-manage',
  templateUrl: './smart-manage.component.html',
  styleUrls: ['./smart-manage.component.css']
})
export class SmartManageComponent implements OnInit {
  zh_CN = {};
  en_US = {};
  msgs: Message[] = [];
  execTypes: any[];

  // 查询条件属性
  paramStr = '';

  // 分页数据
  arrayList: SmartCheckJob[] = [];
  // 总数
  totalSize = 0;
  // 错误信息
  errorMessage: string;
  // 当前页数
  page = 0;
  // 每页条数
  size = 15;
  // 按钮标志
  disabled = true;


  // 选中的任务
  smartCheckJob: SmartCheckJob = new SmartCheckJob();

  // 修改或者增加弹窗的标示
  editDetailDisplay = false;

  // 删除弹窗的标示
  deleteDetailDisplay = false;


  // 选中的网元
  selectNe: any = 'ALL';

   // 选中的网元类型
   selectNeType: any = '';

   // 选中单元类型
   selectUnitType: any = 'ALL';

   // 选择单元弹框输入的条件
   inputUnitParam = '';

  // 网元基础数据
   neData = [];

   // 所有网元
   neList = [] ;

   // 所有单元
   unitList = [];

   // 所有类型
   TypeList = [];

   // 网元类型
   neType = [];

   // 单元类型
   unitType = [];

  // 选择单元的弹窗标示
   unitDetailDisplay = false;

  // 选择单元全部加入或者移除菜单
   unitMenus = [];

   // 单元选中checked
   checkedUnit  = [];

   minDate = new Date();

  // 选择指令的弹窗标示
  itemDetailDisplay = false;

    // 所有指令的列表数据
    commandCheckItemList = [];

    // checkbox选中的指令数据
    checkCommand = [];

    // 移除全部菜单
    itemMenus = [];

   constructor(private smartManageService: SmartManageService, private fb: FormBuilder, private authService: AuthService) {
    this.unitMenus = [
            {label: 'uncheck all', icon: 'fa-remove', command: () => {
                this.allUnitRemove();
            }}
        ];
    this.itemMenus = [
            {label: 'uncheck all', icon: 'fa-remove', command: () => {
                this.removeSelectAllCommand();
            }}
        ];
  }
  // 根据任务名称或者描述查询
  inputKeyup() {
    this.page = 0;
    this.getList();
  }

  // 重置任务查询条件
  reset() {
    this.paramStr = '';
    this.getList();
  }

  // 增加按钮事件
  addJob() {
    this.smartCheckJob = new SmartCheckJob();
    // this.smartCheckJob.id = -1;
    this.disabled = false;
    this.smartCheckJob['unit'] = [];
    this.smartCheckJob['checkItem'] = [];
    this.editDetailDisplay = true;
    this.initForm({jobType: '', execDay: '', jobName: '', jobDesc: ''});
  }

  // 删除按钮时间
  deleteItem(item: SmartCheckJob) {
    this.smartCheckJob = item;
    this.deleteDetailDisplay = true;
  }

  // 修改按钮事件
  editItem(item: SmartCheckJob) {
    this.smartCheckJob = item;
    this.disabled = true;
    this.initForm(this.smartCheckJob);
    this.editDetailDisplay = true;
  }

  // 增加或者修改请求
  preservationItem(values) {
    // this.smartCheckJob["unit"] = [];
    // this.smartCheckJob["checkItem"] = [];
    this.smartCheckJob['jobType'] = values['jobType'];
    this.smartCheckJob['execDay'] = values['execDay'];
    this.smartCheckJob['jobName'] = values['jobName'];
    this.smartCheckJob['jobDesc'] = values['jobDesc'];
    this.smartManageService.preservationJob(this.smartCheckJob)
    .subscribe((ok) => {
          if (ok) {
            this.editDetailDisplay = false;
            this.getList();
            this.showInfo('info', 'Message', 'success!');
            this.authService.appendLogWithContent('/workspace/smart/manage',
              'smart manage', 'add or update smart job:' + this.smartCheckJob['jobName']).subscribe(result => { }, error => { });
          } else {
            this.showInfo('error', 'info', 'error!');
          }
        }
    );

  }

  // 删除任务
  deleteItemChk() {
    this.smartManageService.deleteItem(this.smartCheckJob).subscribe(
      result => {
        if (result) {
          this.getList();
          this.showInfo('info', 'Message', 'success!');
          this.authService.appendLogWithContent('/workspace/smart/manage',
            // tslint:disable-next-line:no-shadowed-variable
            'smart manage', 'remove smart job:' + this.smartCheckJob['jobName']).subscribe( result => { }, error => { });
        } else {
          this.showInfo('error', 'info', 'error!');
        }
      }
    );
  }

  // 加载列表数据
  loadLazy(event) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.getList();
  }

  // 更新列表数据
  getList() {

    this.deleteDetailDisplay = false;
    this.smartManageService.getJob(this.page, this.size, this.paramStr).subscribe(
      data => {
        this.arrayList = this.smartManageService.content;
        this.totalSize = this.smartManageService.totalElements;
      }, error =>  this.errorMessage = <any>error);
  }


/**
 * 选择单元弹框
 */
allUnitJoin() {
    if (this.checkedUnit.length === 0) {
      this.showInfo('warn', 'info', 'select item');
    } else {
      let temp = '';
      this.checkedUnit.forEach(element => {
        temp += 'unit/' + element.id + '\n';
        element.isOk = true;
      });
      this.smartManageService.smartJobUnitAndItem(true, this.smartCheckJob.id, temp, 'unit').subscribe(ok => {
        if (ok) {
          this.checkedUnit = [];
          this.showInfo('info', 'message', 'success');
          this.authService.appendLogWithContent('/workspace/smart/manage',
            'smart manage', 'add smart job unit:' + this.smartCheckJob['jobName']).subscribe(result => { }, error => { });
        } else {
          this.showInfo('error', 'message', 'error');
        }
      });
    }
  }

  allUnitRemove() {
    if (this.checkedUnit.length === 0) {
      this.showInfo('warn', 'info', 'select item');
    } else {
      const num = 0;
      this.checkedUnit.forEach(element => {
        this.smartManageService.smartJobUnitAndItem(false, this.smartCheckJob.id, element.id, 'unit').subscribe(ok => {
          element.isOk = false;
          this.checkedUnit.splice(this.checkedUnit.indexOf(element), 1);
          console.log();
        });
      });
      this.authService.appendLogWithContent('/workspace/smart/manage',
        'smart manage', 'remove smart job all unit:' + this.smartCheckJob['jobName']).subscribe(result => { }, error => { });
      this.showInfo('info', 'message', 'success');
    }
  }

  // 选择单元的按钮时间
  selectChk(item: SmartCheckJob) {
    this.smartCheckJob = item;
    this.unitDetailDisplay = true;
    this.checkedUnit = [];
    // 获取全部网元
    this.smartManageService.getNeList().subscribe( data => {
      this.neData = data;
      // 获取全部类型
      this.smartManageService.getTypes().subscribe( typeData => {
        this.TypeList = typeData;
        this.fillTypes();

      });
    });

    // 获取全部单元
    this.smartManageService.getUnitList().subscribe(data => {
      const temp: any[] = data;
      this.unitList = [];
      temp.forEach(element => {
        element.isOk = false;
        if (this.smartCheckJob.unitNames.indexOf('[' + element.unitName + ']') !== -1) {
          element.isOk = true;
        }
        this.unitList.push(element);
      });
      this.unitList.sort(this.compare);
    });
  }

  compare (obj1, obj2) {
      const val1 = obj1.isOk;
      const val2 = obj2.isOk;
      if (val1 > val2) {
          return -1;
      } else if (val1 < val2) {
          return 1;
      } else {
          return 0;
      }
    }



  // 填充网元类型和单元类型
  fillTypes() {
    this.neType = [];
    this.unitType = [];
    this.neType.push({ label : 'ALL', value : '' });
    this.unitType.push({ label : 'ALL', value : '' });
    const neType = {};
    const unitType = {};
    this.TypeList.forEach(element => {
      if (!neType[element['neType']]) {
        neType[element['neType']] = 'YES';
        this.neType.push({ label : element['neType'], value : element['neType'] });
      }


      if (!unitType[element['unitType']]) {
        if (this.selectNeType === '') {
          unitType[element['unitType']] = 'YES';
          this.unitType.push({ label : element['unitType'], value : element['unitType'] });
        } else {
          console.log(this.selectNeType + '-----' + element['neType']);
          if (this.selectNeType === element['neType']) {
            unitType[element['unitType']] = 'YES';
            this.unitType.push({ label : element['unitType'], value : element['unitType'] });
          }
        }
      }
    });

    this.neList = [];
    this.neList.push({label: 'ALL', value: ''});
    this.neData.forEach(element => {
      if (this.selectNeType === '') {
        this.neList.push({label: element.ne_name, value: element});
      }else if (this.selectNeType === element.ne_type ) {
        this.neList.push({label: element.ne_name, value: element});
      }

    });
  }

  filterUnitAndTypeData() {
    this.fillTypes();
  }


/**
 * 选择指令
 */
  // 选择指令按钮时间
  selectCommand(item: SmartCheckJob) {
    this.smartCheckJob = item;
    this.commandCheckItemList = [];
    this.smartManageService.findAllCommandCheckItemList().subscribe( result => {
      const temp = result;
      temp.forEach(element => {
        element.isOk = this.smartCheckJob.itemIds.indexOf('[' + element.itemId + ']') !== -1;
      });
      this.commandCheckItemList = temp;
      this.commandCheckItemList.sort(this.compare);
      this.itemDetailDisplay = true;
    });

  }

  // 加入选中的所有指令
  joinSelectAllCommand() {
    if (this.checkCommand.length === 0) {
      this.showInfo('warn', 'info', 'select item');
    } else {
      let temp = '';
      this.checkCommand.forEach(element => {
        temp += 'checkItem/' + element.id + '\n';
        element.isOk = true;
      });
      this.checkCommand = [];
      this.smartManageService.smartJobUnitAndItem(true, this.smartCheckJob.id, temp, 'checkItem').subscribe(ok => {
        if (ok) {
          this.showInfo('info', 'message', 'success');
          this.authService.appendLogWithContent('/workspace/smart/manage',
            'smart manage', 'add smart job item:' + this.smartCheckJob['jobName']).subscribe(result => { }, error => { });
        } else {
          this.showInfo('error', 'message', 'error');
        }
      });

    }
  }

  // 移除选中的全部指令
  removeSelectAllCommand() {
    if (this.checkCommand.length === 0) {
      this.showInfo('warn', 'info', 'Please select the item to be deleted.');
    } else {
      this.checkCommand.forEach(element => {
        this.smartManageService.smartJobUnitAndItem(false, this.smartCheckJob.id, element.id, 'checkItem').subscribe(ok => {
          element.isOk = false;
          this.checkCommand.splice(this.checkCommand.indexOf(element), 1);
          console.log();
        });
      });
      this.authService.appendLogWithContent('/workspace/smart/manage',
        'smart manage', 'remove smart job all item:' + this.smartCheckJob['jobName']).subscribe(result => { }, error => { });
      this.showInfo('info', 'message', 'success');
    }
  }



/**
 * 停止全部任务
 *
 */

  // tslint:disable-next-line:member-ordering
  stopAllDetailDisplay = false;

  stopAll() {
    this.smartManageService.stopAll().subscribe(ok => {
      this.stopAllDetailDisplay = false;
      this.getList();
      this.showInfo( ok ? 'info' : 'error', 'message', ok ? 'success' : 'error' );
      this.authService.appendLogWithContent('/workspace/smart/manage',
        'smart manage', 'stop all smart job').subscribe(result => { }, error => { });
    });
  }


/**
 * 停止单个任务
 */

  stopSmart(item, status) {
    this.smartCheckJob = item;

    // this.smartCheckJob['unit'] = [];
    // this.smartCheckJob['checkItem'] = [];
    if (status === '1') {
        this.smartManageService.checkJob(item.id).subscribe( result => {
            if (result) {
                this.smartCheckJob.execFlag = status;
                this.smartManageService.preservationJob(this.smartCheckJob).subscribe(ok => {
                  this.showInfo(ok ? 'info' : 'error', 'message', ok ? 'success' : 'error' );
                  this.authService.appendLogWithContent('/workspace/smart/manage', 'smart manage',
                  'stop smart job:' + this.smartCheckJob['jobName']).subscribe( result_log => {}, error => { });
                });
            } else {
                this.showInfo( 'error', 'message', 'command and unit are not matched!');
            }
        });
    } else {
        this.smartCheckJob.execFlag = status;
        this.smartManageService.preservationJob(this.smartCheckJob).subscribe(ok => {
          this.showInfo(ok ? 'info' : 'error', 'message', ok ? 'success' : 'error' );
          this.authService.appendLogWithContent('/workspace/smart/manage',
            'smart manage', 'stop smart job:' + this.smartCheckJob['jobName'])
            .subscribe(result => { }, error => { });
        });
    }
  }


/**
 * 立即执行
 */

  // tslint:disable-next-line:member-ordering
  execDetailDisplay = false;

  execBtn(item) {
    this.smartCheckJob = item;
    this.execDetailDisplay = true;
  }

  exec() {
    this.smartManageService.execJob(this.smartCheckJob).subscribe( ok => {
      this.execDetailDisplay = false;
      this.authService.appendLogWithContent('/workspace/smart/manage',
        'smart manage', 'exec smart job:' + this.smartCheckJob['jobName']).subscribe(result => { }, error => { });
      this.showInfo(ok ? 'info' : 'error', 'message', ok ? 'success' : 'error' );
    });
  }





/**
 * 公共部分
 */

  // 加入单元、指令
  joinItem(event, href, model) {
      this.smartManageService.smartJobUnitAndItem(event.checked, this.smartCheckJob.id, href, model).subscribe(ok => {
        if (ok) {
            this.showInfo('info', 'Message', 'success!');
            this.authService.appendLogWithContent('/workspace/smart/manage',
              'smart manage', 'add smart job ' + model + ':' + this.smartCheckJob['jobName']).subscribe(result => { }, error => { });
          } else {
            this.showInfo('error', 'Message', 'error!');
          }

      });
  }

  // 信息提示
  showInfo(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
  }

  // tslint:disable-next-line:member-ordering
  checkForm: FormGroup = this.fb.group({});

  ngOnInit() {
    this.zh_CN = {
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    this.en_US = {
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
    };
     this.execTypes = [{ label : 'Project type ' , value : '' },
                      { label : 'Every day' , value : '1' },
                      { label : 'Weekly' , value : '2' },
                      { label : 'Monthly' , value : '3' }];
      this.initForm({jobType: '', execDay: '', jobName: '', jobDesc: ''});
  }

  initForm(check) {
      this.checkForm = this.fb.group({
        'jobType': new  FormControl(check['jobType'], Validators.required),
        'execDay': new FormControl(check['execDay'], Validators.required),
        'jobName': new FormControl(check['jobName'], Validators.required),
        'jobDesc': new FormControl(check['jobDesc'])
      });
  }


}
