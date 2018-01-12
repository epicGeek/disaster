import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { SmartResultDetailService } from './smart-result-detail.service';
import { SmartManageService } from '../smart-manage/smart-manage.service';

@Component({
  selector: 'ices-smart-result-detail',
  templateUrl: './smart-result-detail.component.html',
  styleUrls: ['./smart-result-detail.component.css']
})
export class SmartResultDetailComponent implements OnInit {

  sid = '';
  pageType  = '';
  job  = '';
  ne  = '';
  en_US = {}
  zh_CN = {};

  resultCode  = '';

  unitTypeList = [];

  selectedType : string  = '';

  unitList = [];

  selectedUnit  = '';

  startDate : string = '';

  endDate : string = '';

  paramStr = "";

  resultList = [];

  totalRecords = 0;

  page : number = 0;
  size : number = 12;


  constructor(private route:ActivatedRoute,private router:Router,private manageService:SmartManageService,private detailService : SmartResultDetailService) { }

  export(){
    this.detailService.export(this.sid,this.job,this.ne,this.resultCode,this.selectedType,this.selectedUnit,this.startDate,this.endDate,this.paramStr);
  }

  downLoadLog(item){
    this.detailService.downloadLog(item);
  }


  loadCarsLazy(event){
    this.page = event.first/event.rows;
    this.findResulltListPage(this.page);
  }

  findResulltListPage(page){
    const unitName = this.selectedUnit ? this.selectedUnit['unitName'] : '';
    this.detailService.getSmartCheckResultPage(this.sid, this.job, this.ne, this.resultCode,
      this.selectedType, unitName, this.startDate, this.endDate, this.paramStr, page, this.size).subscribe(result => {
      this.resultList = result.content;
      this.totalRecords = result.totalElements;
    });
  }




  // 获取单元全部类型
  getUnitTypes() {
    this.manageService.getTypes().subscribe( result => {
      this.unitTypeList = [];
      let temp = [];
      this.unitTypeList.push({ label : 'ALL' , value : '' });
      result.forEach(element => {
        if(!temp[element.unitType]){
          this.unitTypeList.push({ label : element.unitType , value : element.unitType });
          temp[element.unitType]=element.unitType;
        }
      })  
    });
  }

  getAllUnit(){
    this.manageService.getUnitList().subscribe(units => {
      this.unitList = [];
      this.unitList.push({ label : 'ALL' , value : '' });
      units.forEach( element => { 
        this.unitList.push({ label : element.unitName , value : element });
      }); 
    });
  }
 

  backresult(){
    this.router.navigate(['workspace/smart/result/filter',{id : this.sid,name: this.pageType }]);
  }

  ngOnInit() {
    this.route.params.subscribe( data => {
      this.sid = data['sid'] ? data['sid'] : '';
      this.job = data['job'] ? data['job'] : '';
      this.ne = data['ne'] ? data['ne'] : '';
      this.pageType = data['pageType'] ? data['pageType'] : '';
      this.resultCode = data['code'] ? data['code'] : '';
    })
    //获取单元全部类型
    this.getUnitTypes();
    //获取全部单元
    this.getAllUnit();
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
  }

}