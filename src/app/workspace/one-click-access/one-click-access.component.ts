import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { OneClickAccessService } from './one-click-access.service';
import { AuthService} from '../../auth/auth.service';
@Component({
  selector: 'ices-one-click-access',
  templateUrl: './one-click-access.component.html',
  styleUrls: ['./one-click-access.component.css']
})
export class OneClickAccessComponent implements OnInit {

  queryNeType = '';

  // 网元类型
  neType = [];

  neTypeDropdown = [];

  size: Number;
  page: Number;

  queryNeName = '';

  queryUnitType = '';

  // 查询条件属性
  paramStr = '';

  unitList = [];

  totalRecords = 0;

  // 网元基础数据
  neData = [];

  // 所有网元
  neList = [] ;

  // 所有类型
  TypeList = [];
  // 单元类型
  unitType = [];
  loginLogRecords = [];
  response: string;
  consoleDisplay: boolean;
  webGUIListDisplay: boolean;
  loginLogDisplay: boolean;


  // from 132
  dhssList = [];
  webTemplate = {};
  templateArray = [];
  selectUnit = {};


  showClickDisplay = false;

  constructor(private oneClickAccessService: OneClickAccessService, private authService: AuthService) { }

  getUnitData(event) {
      this.page = event.first / event.rows;
      this.size = event.rows;
      this.refushUnitData();
  }

  count() {

  }

  query() {
    this.getUnitData({
      first : 0,
      rows : this.size
    });
  }

  resetQuery() {
    this.queryNeName = '';
    this.queryNeType = '';
    this.queryUnitType = '';
    this.paramStr = '';
    this.refushUnitData();
  }

  refushUnitData() {
       const item = {
            page: this.page,
            size: this.size,
            queryNeType: this.queryNeType,
            queryNeName: this.queryNeName,
            queryUnitType: this.queryUnitType,
            paramStr: this.paramStr
      };
      this.oneClickAccessService.findData(item).subscribe(result => {
          this.unitList = result['content'] || [];
          this.totalRecords = result['totalElements'];
      });
  }

  fillQueryTypes() {

    this.neType = [];
    this.unitType = [];
    this.neType.push({ label : 'ALL NE TYPE', value : '' });
    this.unitType.push({ label : 'ALL UNIT TYPE', value : '' });
    const neType = {};
    const unitType = {};

    this.TypeList.forEach(element => {
      if (!neType[element['neType']]) {
        neType[element['neType']] = 'YES';
        this.neType.push({ label : element['neType'], value: element['neType'] });
      }

      if (!unitType[this.queryUnitType]) {
        if (this.queryNeType === '') {
          unitType[element['unitType']] = 'YES';
          this.unitType.push({ label : element['unitType'], value : element['unitType'] });
        } else {
          if ( this.queryNeType === element['neType']) {
            unitType[element['unitType']] = 'YES';
            this.unitType.push({ label : element['unitType'], value : element['unitType'] });
          }
        }
      }

    });

    this.neList = [];
    this.neList.push({label: 'ALL NE', value: ''});
    this.neData.forEach(element => {

      if (this.queryNeType === '') {
        this.neList.push({label: element.ne_name, value: element.id});
      }else if (this.queryNeType  === element.ne_type ) {
        this.neList.push({label: element.ne_name, value: element.id});
      }
    });

  }

  ngOnInit() {
      this.oneClickAccessService.getNeList().subscribe(result => {
               this.neData = result;
               this.oneClickAccessService.getTypes().subscribe(innerResult => {
                        this.TypeList = innerResult;
                        this.fillQueryTypes();
               });
      });

      this.oneClickAccessService.getTemplates().subscribe(result => {
        result.forEach(template => {
          const tmp = this.webTemplate[template['unit_type']];
          const array: any[] = tmp ? tmp : [];
          array.push(template);
          this.webTemplate[template['unit_type']] = array;
        });
      });

      this.oneClickAccessService.getClickRole().subscribe(result => {
          result.forEach(item => {
              if (item['role_name'] === 'one_click_unit_login') {
                  this.showClickDisplay = true;
              }
          });
      });
      // this.oneClickAccessService.getSelectedDatas().subscribe(result=>{

      //     this.dhssList.push({label:'ALL DHSS',value:''});
      //     this.dhssList = this.dhssList.concat(result['dhss']);
      // })
  }
  accessConsole(unit: EquipmentUnit): void {
    const connectUnitName = unit.unitName;
    const connectUrl = this.oneClickAccessService.generateConsoleLink(connectUnitName);
    window.open('https://127.0.0.1:4200/' + connectUrl, '_blank');
  }
  showWebGUIList(unit: EquipmentUnit): void {
        this.selectUnit = unit;
        this.templateArray = this.webTemplate[unit.unitType];
        this.webGUIListDisplay = true;
  }

  showTemplate(template) {
      const tempUrl = template.url_template ? template.url_template : '';
      const url = tempUrl.replace('127.0.0.1', this.selectUnit['serverIp']);
      window.open(url, '_blank');
  }

  oneClickPage(item) {
      const userMessage = localStorage.getItem('userMessage');
      const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
      const CLICK_ENDPOINT =
        apiConfig['oneClickURL'] + 'mml-interface/' + item.id + '/' + localStorage.getItem('token') + '/' + userMessage;
      this.authService.appendLogWithContent('', '', item.unitName).subscribe(result => {}, error => { });
      window.open(CLICK_ENDPOINT, '_blank');
  }

  showLog(item) {
    this.loginLogDisplay = true;
    const unitName = item['unitName'];
    this.getLoginLogData(unitName);

  }

  getLoginLogData(unitName) {
    this.oneClickAccessService.getConsoleConnectionInstance(unitName).subscribe(resultData => {
      this.loginLogRecords = resultData;
    });
  }
  downloadLog(item) {
    const filePath = item.logPath;
    this.oneClickAccessService.downloadLog(filePath);
  }
  accessConsolePrime(unit: EquipmentUnit): void {
    this.consoleDisplay = true;
  }
  onCommand(event) {
    if (event.command === 'date') {
      this.response = new Date().toDateString();
    } else {
      this.response = 'Unknown command: ' + event.command;
    }
  }

}
export class EquipmentNe {
  id: number;
  neName: string;
  neType: string;
}
export class EquipmentNeUnitTypeRel {
  unitType: string;
  neType: string;
}
export class EquipmentUnit {
  unitName: string;
  unitType: string;
  neType: string;
  neName: string;
}
