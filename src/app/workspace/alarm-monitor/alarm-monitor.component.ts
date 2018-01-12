import { Component, OnInit } from '@angular/core';
import {TreeNode,Message,TabPanel,TabView,ConfirmationService} from 'primeng/primeng';
import {AlarmMonitorService,UserAlarm,AlarmReceiveRecord,NotAlarmNum} from './alarm-monitor.service';
import * as moment from 'moment';
import { AuthService} from '../../auth/auth.service';
@Component({
  selector: 'ices-alarm-monitor',
  templateUrl: './alarm-monitor.component.html',
  styleUrls: ['./alarm-monitor.component.css'],
  providers:[ConfirmationService]
})
export class AlarmMonitorComponent implements OnInit {

  constructor(private alarmMonitorService:AlarmMonitorService,
              private confirmationService:ConfirmationService,private authService:AuthService) { }
  msgs: Message[] = [];
  activeIndex : number = 0;
  ngOnInit() {
    // this.alarmMonitorService.testXml().subscribe( result => {console.log(result)});

    this.notAlarmNum();
    //添加根节点
    this.treeNodes.push(this.rootNode);
    //默认加载第二级节点
    this.loadNode({ node : this.rootNode }); 
    //添加全网告警panel  
    let key = this.rootTab.header;
    this.tabMap[key] = this.rootTab;
    
    //加载dhss下拉框数据
    this.getDhssList(this.tabMap[key]);
    
  }

  

/**
 * 
 * 左侧菜单
 */


  //根节点
  rootNode = { label: "ALL", data: "ALL", icon: "fa-align-justify", 
    expanded:true,children:[],totalCount:0,dayCount:0 };

  //tree菜单数据
  treeNodes = [];

  //选中的node
  selectedNode = null;

  //条件搜索
  userAlarm:UserAlarm = {id:null,unitName:"", cnum:"", startTime:null,  endTime:null,  createTime:null,
                         alarmNum:"",  keyword:"",  alarmDesc:"",  userName:"",  isCollection:true};
  
  

  userAlarmList : UserAlarm[] = [];

  selectedUserAlarm : UserAlarm[];

  //根据ID批量取消收藏
  cancelMultiple(selectedUserAlarm:UserAlarm[]){
    this.confirmationService.confirm({
        message: 'cancel follow ?',
        header: 'message',
        icon: 'fa fa-trash',
        accept: () => {
            selectedUserAlarm.forEach( element => {
              this.alarmMonitorService.deleteItem(element).subscribe( result => { 
                this.userAlarmList.splice(this.userAlarmList.indexOf(element),1);
              });
            })
            this.treeNodes[0].expanded = false;
            this.getUserAlarmParam();
            // this.selectedUserAlarm = [];
        }
    });
  }

  //单个取消收藏
  cancelParam(item){
    let arr : UserAlarm[] = [item];
    this.cancelMultiple(arr);
    
  }

  /*加入或者收藏*/
  joinOrCancelCollection(event,item){
    event.stopPropagation();
    let message = "follow";
    let itemIcon = "fa fa-star";
    let userAlarm:UserAlarm = {};
    this.userAlarm.cnum = item.data.cnum;
    this.userAlarm.isCollection = true;
    if(item.isCollection != "fa fa-star-o"){ 
      message = "unfollow";
      itemIcon = "fa fa-star-o";
      this.userAlarm.isCollection = false;
    }
    this.confirmationService.confirm({
        message: message,
        header: 'message',
        icon: itemIcon,
        accept: () => {
            this.alarmMonitorService.joinOrCancelCollection(this.userAlarm)
            .subscribe( 
              result => { 
                if(result){
                  this.showMessage({severity:"info",summary:"message",detail:message+" success"});
                  item.isCollection = itemIcon; 
                }
              },
              error => {console.log(error) })
        }
    });
  }

  //展开节点加载子节点
  loadNode(event){
      let dhssName = event.node.data.dhss ? event.node.data.dhss : "";
      let neName = event.node.data.ne ? event.node.data.ne : "";
      
      
      this.alarmMonitorService.getAllDhssNames(dhssName,neName)
      .subscribe(result => { 
        event.node.totalCount = 0;
        event.node.dayCount = 0;
        result.forEach(element => {
            element.icon="fa-sitemap";
            element.data = event.node.data.dhss ? 
                                                { ne : element.label ,cnum : element.data } : 
                                                { dhss : element.label ,cnum : element.data };
            event.node.totalCount += element['totalCount'];
            event.node.dayCount += element['dayCount'];
        });
        event.node.children = result; 
      },error => { 
        console.log(error) 
      });
  }

  //点击用户收藏的信息查询数据
  searchAlarmByParam(item,alarmTabView:TabView){
    let userAlarm:UserAlarm = item;
    if(userAlarm.startTime){
       userAlarm.startTime = this.formatDate(userAlarm.startTime);
    }
    if(userAlarm.endTime){
       userAlarm.endTime = this.formatDate(userAlarm.endTime);
    }
    this.addTab("follow",true,userAlarm,[],false,alarmTabView);
  }


  //控制按钮的显示与隐藏
  buttonDisplay:boolean = true;

  tabHeader = '';
  //左侧切换面板事件
  tabClick(event){
    this.tabHeader = event.originalEvent.srcElement.innerText;
    this.buttonDisplay = event.index == 2 ? false : true;
    if(!this.buttonDisplay){
      this.getUserAlarmParam();
    }
  }

  getUserAlarmParam(){
    this.alarmMonitorService.getUserAlarmParamList()
      .subscribe( result => {this.userAlarmList=result},error => {console.log(error)});
  }

  //重置按钮事件
  resetParam(){
    this.userAlarm = {};
    this.selectedNode = null;
  }

  //收藏查询条件
  collectioParam(){
    this.userAlarm.cnum = this.selectedNode ? this.selectedNode.data.cnum : "";
    this.userAlarm.isCollection = true;
    this.alarmMonitorService.joinOrCancelCollection(this.userAlarm)
      .subscribe( 
        result => { 
          if(result){
            this.showMessage({severity:"info",summary:"message",detail:"success"});
            this.selectedNode.isCollection = "fa fa-star"; 
          }
        },
        error => {console.log(error) })
  }


/**
 * 
 * 
 * 右侧列表
 */

  

  sameDay = moment(new Date()).format('YYYY-MM-DD 00:00:00');



  
 

  //dhss下拉框
  dhssNameList = [];

  //tabPanels
  tabMap = {};

  alarmDescDisplay : boolean = false;


  //非重要告警号
  nonImportantNum:NotAlarmNum={};

  rootTab = {header:"ALL ALARM",closable:false,data:[],alarmModel:
                  {startTime:this.sameDay,notAlarmNo:this.nonImportantNum },dhssList:
                  [{label:'ALL HSS',  value:''}] ,showDhss:true};

  //获取非重要告警号
  notAlarmNum(){
    this.alarmMonitorService.getNotAlarmNum()
    .subscribe( result => { 
      let alarmNumList = [];
      result.forEach(item=>{
          alarmNumList.push(item['alarmNum']);
      });
      this.alarmNoList = result;
      // this.nonImportantNum = result.length > 0 ? result[0] : {} ;
      this.nonImportantNum.alarmNoArray = alarmNumList.join('_');
      this.tabMap[this.rootTab.header].alarmModel.notAlarmNo = this.nonImportantNum.alarmNoArray;
      //加载全网告警列表 
      this.getData(this.tabMap[this.rootTab.header]); 
    });
  }

  alarmNoList = [];

  items = [{label: 'Delete', icon: 'fa-close', command: (event) => this.removeAlarmNo()}];

  alarmContentMenuitems = [{label: 'Cancel', icon: 'fa-close', command: (event) => { this.cancelAlarmDisplay = true;this.cancelDesc="";} }];

  alarmNoModel = { alarmNum : '' , createDate :'' , createUser : '' ,alarmDesc :'' };

  selectedAlarmNum = {};

  selectedAlarmModel = {cancelTime:""};

  cancelAlarmDisplay = false;

  cancelDesc = "";

  cancelAlarm(alarmTabView){
      this.alarmMonitorService.cancelAlarm(this.selectedAlarmModel)
      .subscribe(result =>{
        this.authService.appendLogWithContent('', '', 
        'cancel :'+this.selectedAlarmModel['notifyId']+','
        + this.selectedAlarmModel['neName'] + ' , '
        + this.selectedAlarmModel['alarmLevel'] + ' , '
        + this.selectedAlarmModel['alarmNo'] + ' , '
        + this.cancelDesc)
        .subscribe(result => {}, error => { });
        this.showMessage({severity:"success",summary:"mes sage",detail:"success"});
        this.cancelAlarmDisplay=false;
        let tabs:any[] =alarmTabView.tabs;
        tabs.forEach(element => {
          this.getData(this.tabMap[element.header]);
        });
      })
      
  }

  removeAlarmNo(){
      this.confirmationService.confirm({
          message:'Delete?',
          header:'confirm',
          accept:()=>{
                this.alarmMonitorService.removeAlarmNum(this.selectedAlarmNum).subscribe(result=>{
                      this.notAlarmNum();
                      this.selectedAlarmNum['_links'] = {};
                      this.authService.appendLogWithContent('', '', 
                      this.tabHeader + ' remove alarm no:'+this.selectedAlarmNum['alarmNum']+','
                      + this.selectedAlarmNum['createDate'] + ','
                      + this.selectedAlarmNum['createUser'] + ','
                      + this.selectedAlarmNum['alarmDesc'])
                      .subscribe(result => {}, error => { });

                      this.showMessage({severity:"success",summary:"message",detail:"success"});
                })
          }
      });
  }

  editAlarmNo(){
      if(this.alarmNoModel.alarmNum == ''){
          this.showMessage({severity:"warn",summary:"message",detail:"Please enter an alarm number"});
      }else if(this.alarmNoModel.alarmDesc == ''){
          this.showMessage({severity:"warn",summary:"message",detail:"Please enter an alarm desc"});
      }else{
          this.alarmNoModel.createUser = localStorage.getItem('userMessage');
          this.alarmMonitorService.saveAlarmNum(this.alarmNoModel).subscribe(result=>{
              this.notAlarmNum();
              this.authService.appendLogWithContent('', '', 
              this.tabHeader + ' add alarm no:'+result['alarmNum']+','+result['createDate']+','
              +result['createUser']+','+result['alarmDesc']).subscribe(result => {}, error => { });
              this.alarmNoModel = { alarmNum : '' , createDate :'' , createUser : '' ,alarmDesc :'' };
              this.showMessage({severity:"success",summary:"message",detail:"success"});
          });
      }
  }

  saveNotAlarmNum(){
      this.alarmMonitorService.saveOrUpdateNotAlarmNum(this.nonImportantNum)
      .subscribe( result => { 
        if(result){
          this.authService.appendLogWithContent('', '', 'edit alarm no:'+result['alarmNoList']).subscribe(result => {}, error => { });
          this.nonImportantNum = result;
          this.showMessage({severity:"info",summary:"message",detail:"success"});
        } 
      });
  }
  alarmDescStr = '';
  //获取告警描述
  alarmDesc(item){
    // let SupplInfo:string = item.supplInfo;
    this.alarmDescDisplay = true;
    this.alarmDescStr = 'Suppl Info :\n\n';
    this.alarmDescStr += '\r'+(item.supplInfo ? item.supplInfo.replace('Suppl Info','') : '') + '\n\n\n\n' ;
    this.alarmDescStr += 'alarmDesc:\n\n\r';
      this.alarmMonitorService.getAlarmDesc(item)
      .subscribe( result => {
          this.alarmDescStr += (result.length == 0 ? '' : result['_embedded']['alarm-rule'][0].alarmDesc);
      });
  }
 

  //下拉框选择事件
  selectedDhss(event,alarmItem){
    alarmItem.alarmModel.cnum = event.value;
    this.getData(alarmItem);
  }

  //按钮查询事件
  searchBtn(alarmTabView:TabView){
    let header = "ALL ALARM";
    let data = this.selectedNode ? this.selectedNode.data : null;
    let model = {};
    if(data){
      header = this.selectedNode.label;
      let  key :string []= Object.keys(data);
      key.forEach(element=>{
          model[element] = data[element];
      })
    } 
    

    model['startTime'] = this.userAlarm.startTime ? 
    this.formatDate(this.userAlarm.startTime) : this.userAlarm.startTime;
    model['endTime'] = this.userAlarm.endTime ? 
    this.formatDate(this.userAlarm.endTime) : this.userAlarm.endTime;
    model['alarmNum'] = this.userAlarm.alarmNum;
    model['keyword'] = this.userAlarm.keyword;
    this.addTab(header,true,model,[],false,alarmTabView);
  }
  
  //添加一个tab
  addTab(header,closable,userAlarm,dhssList,showDhss,tabView:TabView){ 
    
    let NodeTab = {header:header,closable:closable,data:[],alarmModel:
                  userAlarm,dhssList:dhssList ,showDhss:showDhss};
     
    this.tabMap[header] = NodeTab; 

    // this.getData(this.tabMap[header]);
    this.alarmMonitorService.getAlarmReceiveRecord(this.tabMap[header].alarmModel)
      .subscribe( result => { this.tabMap[header].data = result; this.openPanel(tabView,header);  });
    
  }

  openPanel(tabView:TabView,key){
    tabView.tabPanels.forEach( element => {
      element.selected = (element.header == key) ? true : false;
      element.closed = element.selected  ? false : element.closed; 
    });
  }

  getKeys(item){
    return Object.keys(item);
  }

  getData(item){
     return this.alarmMonitorService.getAlarmReceiveRecord(item.alarmModel)
      .subscribe( result => { item.data = result;   });
  }
  

  getDhssList(item){
    //加载dhss下拉框数据
    this.alarmMonitorService.getDhssNameList()
    .subscribe( result => { 
        result.forEach(element => {
            item.dhssList.push(element);
        })
     } , error => {});
  }

  //格式化日期
  formatDate(dateTime) : string{
    return moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
  }

  //提示信息
  showMessage(item:Message) {
    this.msgs = [];
    this.msgs.push(item);
  }

}

