import { Component, OnInit } from '@angular/core';
import { KpiMonitorService } from './kpi-monitor.service';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute, Params, Route } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'ices-kpi-monitor',
  templateUrl: './kpi-monitor.component.html',
  styleUrls: ['./kpi-monitor.component.css']
})
export class KpiMonitorComponent implements OnInit {

  constructor(private kpiMonitorService: KpiMonitorService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.initDropdownData();
    this.initDefaultSelectData();
    this.route.params.subscribe(data => {
      this.kpiNameSelected = data['code'] ? data['code'] : '';
    });
  }
  initDefaultSelectData() {
    this.zh_CN = {
      dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
      monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    };
    this.en_US = {
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
      dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "June.", "July.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
    }
    this.startDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 12));
    this.endDate = new Date();

  }
  uniqueArray(array: string[]) {
    let set = new Set(array);
    let selectItem: string[] = [];
    set.forEach(element => {
      selectItem.push(element);
    });
    return selectItem;
  }

  dropdownModel = {
    kpiNames: [],
    dhssNames: [],
    kpiTypes: [],
    physicalLocations: [],
    neTypes: [],
    neNames: [],
    unitNames: [],
    unitTypes: []
  };

  onChangeDropdown(allData, dropdownName, params, labelName) {
    this.dropdownModel[dropdownName] = [{ label: 'ALL ' + labelName, value: null }];
    allData.forEach(element => {
      let isNullFlag = true;
      let flag = true;
      let keys = Object.keys(params);
      keys.forEach(param => {
        if (params[param] != null && params[param] != '') {
          flag = (element[param] != params[param] && element[param] && element[param].indexOf('/'+params[param]+'/') ==-1) ? false : flag;
          isNullFlag = false;
        }
      });

      if (isNullFlag || flag) {
        this.dropdownModel[dropdownName].push(element);
      }
    });
  }

  kpiTypeChangeDropdown() {
    this.onChangeDropdown(this.allKpiNames, 'kpiNames', { kpiType: this.kpiTypeSelected }, 'KPI NAME')
  }

  dhssChangeDropdown() {
    this.onChangeDropdown(this.allNeData, 'neNames',
      {
        dhss: this.dhssNameSelected,
        location: this.physicalLocationSelected,
        neType: this.neTypeSelected
      }, 'NE');
    this.onChangeDropdown(this.allKpiNames, 'kpiNames', { neType: this.neTypeSelected }, 'KPI NAME');
    this.onChangeDropdown(this.allUnitTypes, 'unitTypes', { neType: this.neTypeSelected }, 'UNIT TYPE');
    this.onChangeDropdown(this.allKpiTypes, 'kpiTypes', { neType: this.neTypeSelected }, 'KPI TYPE');
    
  }

  neChangeDropdown() {
    this.onChangeDropdown(this.allUnitData, 'unitNames', { neName: this.neNameSelected, unitType: this.unitTypeSelected }, 'UNIT');
  }

  initDropdownData() {
    //this.dropdownModel.dhssNames = [{ label: "ALL DHSS", value: null }];
    this.dropdownModel.kpiNames = [{ label: "ALL KPI NAME", value: null }];
    this.dropdownModel.kpiTypes = [{ label: "ALL KPI TYPE", value: null }];
    this.dropdownModel.physicalLocations = [{ label: "ALL LOCATION", value: null }];
    this.dropdownModel.neTypes = [{ label: "ALL NE TYPE", value: null }];
    this.dropdownModel.neNames = [{ label: "ALL NE", value: null }];
    this.dropdownModel.unitNames = [{ label: "ALL UNIT", value: null }];
    this.dropdownModel.unitTypes = [{ label: "ALL UNIT TYPE", value: null }];

    this.size = 15;

    this.kpiMonitorService.getDropdownInfo().subscribe(resultData => {
      this.allNeData = resultData['ne'];
      this.allUnitData = resultData['unit'];
      this.allUnitTypes = resultData['unitType'];
      this.dropdownModel.dhssNames = this.dropdownModel.dhssNames.concat(resultData['dhss']);
      this.dropdownModel.physicalLocations = this.dropdownModel.physicalLocations.concat(resultData['location']);
      this.dropdownModel.neTypes = this.dropdownModel.neTypes.concat(resultData['neType']);
      this.dropdownModel.neNames = this.dropdownModel.neNames.concat(resultData['ne']);
      this.dropdownModel.unitNames = this.dropdownModel.unitNames.concat(resultData['unit']);
      this.dropdownModel.unitTypes = this.dropdownModel.unitTypes.concat(resultData['unitType']);
      this.allNeData.forEach(element => {
        this.neString.push(element.label);
      });
    })

    this.kpiMonitorService.getKpiDropdownInfo().subscribe(resultData => {

      let content: any[] = resultData;
      let temp = [];
      let tempKpiType = [];
      let kpiTemp = [];

      let kpiTypeTemp = {};
      
      content.forEach(element => {
        let str = kpiTypeTemp[element['kpi_category']];
        kpiTypeTemp[element['kpi_category']] =( str ? str : '' )+'/'+element['kpi_ne_type']+'/';
        kpiTemp.push({ label: element['kpi_name'], value: element['kpi_code'], kpiType: element['kpi_category'], neType: element['kpi_ne_type'] });
      })

      content.forEach(element => {
          if (temp.indexOf(element['kpi_category']) == -1) {
            tempKpiType.push({ label: element['kpi_category'], value: element['kpi_category'],neType:kpiTypeTemp[element['kpi_category']]});
            temp.push(element['kpi_category']);
          }
      })
      this.dropdownModel.kpiNames = this.dropdownModel.kpiNames.concat(kpiTemp);
      this.dropdownModel.kpiTypes = this.dropdownModel.kpiTypes.concat(tempKpiType);
      this.allKpiNames = this.dropdownModel.kpiNames;
      this.allKpiTypes = tempKpiType;
    });

  }
 
  neString = [];
  getKpiMonitorHistoryData(event) {
        let searchParams = {
          dhssName: this.dhssNameSelected,
          physicalLocation: this.physicalLocationSelected,
          neType: this.neTypeSelected,
          neName: this.neNameSelected,
          unitName: this.unitNameSelected,
          kpiName: this.kpiNameSelected,
          startTime: moment(this.startDate).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(this.endDate).format('YYYY-MM-DD HH:mm:ss'),
          kpiType: this.kpiTypeSelected,
          unitType: this.unitTypeSelected,
          //pageable
          page: event.first / event.rows,
          size: event.rows,
        };
        this.size = event.rows;
        this.kpiMonitorService.getKpiHistoryData(searchParams).subscribe(resultData => {
          this.kpiMonitorHistoryDataTable = resultData["content"];
          this.totalRecords = resultData.totalElements;
        });
  }
  query() {
    this.getKpiMonitorHistoryData({ first: 0, rows: this.size });
  }

  reset() {
    this.dhssNameSelected = null;
    this.physicalLocationSelected = null;
    this.neTypeSelected = null;
    this.neNameSelected = null;
    this.unitNameSelected = null;
    this.kpiTypeSelected = null;
    this.kpiNameSelected = null;
    this.unitTypeSelected = null;
    this.query();
  }
  export() {
    //this.query();
    let neString = [];
    this.allNeData.forEach(element => {
      neString.push(element.label);
    });
    let searchParams = {
      dhssName: this.dhssNameSelected,
      physicalLocation: this.physicalLocationSelected,
      neType: this.neTypeSelected,
      neName: this.neNameSelected,
      unitName: this.unitNameSelected,
      kpiName: this.kpiNameSelected,
      unitType: this.unitTypeSelected,
      startTime: moment(this.startDate).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(this.endDate).format('YYYY-MM-DD HH:mm:ss'),
      kpiType: this.kpiTypeSelected,
      neString: neString.join(",")
    };
    this.kpiMonitorService.exportReport(searchParams);
  }

  zh_CN = {};
  en_US = {};

  startDate: Date;
  endDate: Date;
  //drop down attributes
  dhssNames: SelectItem[];
  dhssNameSelected: string = '';
  physicalLocations: SelectItem[];
  physicalLocationSelected: string = '';
  neTypes: SelectItem[];
  neTypeSelected: string = '';
  neNames: SelectItem[];
  neNameSelected: string = '';
  unitNames: SelectItem[];
  unitTypeSelected = '';
  unitNameSelected: string = '';
  kpiTypes: SelectItem[];
  kpiTypeSelected: string = '';
  kpiNames: SelectItem[];
  kpiNameSelected: string = '';
  kpiMonitorHistoryDataTable = [];
  size: number;
  totalRecords: number;
  allNeData = [];
  allUnitData: any;
  kpiNameAndKpiTypeObject: any;
  allKpiNames: string[];
  allUnitTypes = [];
  allKpiTypes = [];
}
