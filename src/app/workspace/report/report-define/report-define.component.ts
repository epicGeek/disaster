import { Component, OnInit } from '@angular/core';
import {MenuItem, ConfirmationService, RadioButtonModule} from 'primeng/primeng';
import { ReportCommonService } from '../report-common.service';
import {
  ReportDefineService, TreeNodeModel, TempleVo, MenuKpiVo,
  TreeArrayModel, PageTemplet, StatVo, TempletDesc
} from './report-define.service';
import { Http, Headers, URLSearchParams, Response,RequestOptions } from '@angular/http';
import { AuthService} from '../../../auth/auth.service';
@Component({
  selector: 'ices-report-define',
  templateUrl: './report-define.component.html',
  styleUrls: ['./report-define.component.css'],
  providers: [ReportCommonService, ConfirmationService, ReportDefineService]
})
export class ReportDefineComponent implements OnInit {

  constructor(private reportCommonService: ReportCommonService,
              private reportDefineService: ReportDefineService,
              private confirmationService: ConfirmationService,private authService:AuthService) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.STAT_ENDPOINT = apiConfig['reportURL'];
  }
  globalUrl = {};
  STAT_ENDPOINT = '';

  msgs = [];

  selectedGroup = "";

  templateMainTitle = "";

  ngOnInit() {
    //初始化树状菜单
    // this.initTreeView(null);
    //右键菜单
    // this.items = [ {label: '增加节点', icon:'fa-remove',command:(event) => this.addPjNodeClick(this.selectedNode)},
    //                {label: '增加子节点', icon: 'fa-plus', command: (event) => this.addNodeClick(this.selectedNode)},
    //                {label: '修改节点', icon: 'fa-edit', command: (event) => this.editNodeClick(this.selectedNode)},
    //                {label: '设置属性', icon: 'fa-edit', command: (event) => this.setNodeProperties(this.selectedNode)},
    //                {label: '删除节点', icon:'fa-remove',command:(event) => this.removeNodeClick(this.selectedNode)} ];
    

    this.items = [ {label: 'Add Node', icon:'fa-remove',command:(event) => this.addPjNodeClick(this.selectedNode)},
                   {label: 'Add Child Node', icon: 'fa-plus', command: (event) => this.addNodeClick(this.selectedNode)},
                   {label: 'Edit Node', icon: 'fa-edit', command: (event) => this.editNodeClick(this.selectedNode)},
                   {label: 'Set Properties', icon: 'fa-edit', command: (event) => this.setNodeProperties(this.selectedNode)},
                   {label: 'Delete Node', icon:'fa-remove',command:(event) => this.removeNodeClick(this.selectedNode)} ];


    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/templet/network/colsoptions')
        .subscribe((result) => this.kpisOptions = result);
  }
  addTemplate() {
    this.templateId = null;
    this.initTreeView(null);
    this.templateNameInDialog = null;
    this.templateDescInDialog = null;
    this.addOrEditTemplateDisplay = true;

  }
  edit(templateId,templateName, templateDescription) {
    this.templateId = templateId;
    this.initTreeView(templateId);
    console.log(this.tmpTreeNodeArray);
    console.log('this.tmpTreeNodeArray::::::'+this.tmpTreeNodeArray.length);
    console.log('templateId:'+templateId);
    this.addOrEditTemplateDisplay = true;
    this.templateNameInDialog = templateName;
    this.templateDescInDialog = templateDescription;
  }
  delete(templetId) {
    this.confirmationService.confirm({
        message: 'Are you sure?',
        header: 'Delete',
        icon: 'fa fa-trash',
        accept: () => {
            const delParams = new URLSearchParams();
            delParams.append('templetId', templetId);
            this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/templet/reports/delete',delParams)
              .subscribe(result => {
                this.authService.appendLogWithContent('/workspace/report/define', 'reportDefine', 'remove template id:'+templetId).subscribe(result => {}, error => { });
                // if(result.indexOf('html>')!=-1){
                //   localStorage.setItem('serviceTicket',null);
                //   this.router.navigate(['/login']);
                // }
                this.statVo = result;
                console.log('removeUser:'+result);
                if(this.statVo.stat=='success'){
                  this.loadTemplets(this.page,this.size);
                  this.showInfo('success','delete success');
                }
                else{
                  this.showInfo('fail','delete failed');
                }
              });

        }
    });
  }
  clone(templetId) {
    const cloneParams = new URLSearchParams();
    cloneParams.append('templetId', templetId);
    this.reportCommonService.saveDatasWithXform(this.STAT_ENDPOINT + '/templet/reports/clone',cloneParams)
      .subscribe(result => {
        // if(result.indexOf('html>')!=-1){
        //   localStorage.setItem('serviceTicket',null);
        //   this.router.navigate(['/login']);
        // }
        this.statVo = result;
        console.log('removeUser:'+result);
        if(this.statVo.stat=='success'){
          this.loadTemplets(this.page,this.size);
          this.showInfo('success','Clone success');
        }else{
          this.showInfo('fail','Clone failed');
        }
      });
  }
  templateText(templetId) {
    this.templateId = templetId;
    let params = '';
    if(templetId!=null){
      params = '?templetId=' + templetId;
    }
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/templet/dhssdesc/toedit' + params)
        .subscribe((result) => this.templetDesc = result);
    this.templateTextDisplay = true;
  }
  closeTemplateText(){
    this.templateId = null;
    this.templetDesc = {};
    this.templateTextDisplay = false;
  }
  saveTemplateText() {
    console.log(this.templetDesc);
    console.log(this.templateId);
    this.templetDesc.templetId = this.templateId;
    this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/templet/dhssdesc/edit',this.templetDesc)
        .subscribe(result => {
          console.log('result:'+result);
          this.loadTemplets(this.page,this.size);
          this.templetDesc = [];
          this.templateId = null;
          this.templateTextDisplay = false;
          this.showInfo('success','save success');
        });
  }

  initTreeView(templetId){
    // this.treeNodeList = this.reportDefineService.initTreeView();
    let params = '';
    if(templetId!=null){
      params = '?templetId='+templetId;
    }
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/templet/dhssreports/menukpi' + params)
        .subscribe(result => {
          this.treeNodeList = result;
          this.treeToTmpArray(this.treeNodeList);
        });

  }

  loadLazy(event){
    this.page = event.first/event.rows + 1;
    this.size = event.rows;
    console.log('this.page:'+this.page);
    console.log('this.size:'+this.size);
    this.loadTemplets(this.page,this.size)
  }

  loadTemplets(page,size){
    this.reportCommonService.getRemoteData(this.STAT_ENDPOINT + '/templet/dhsstemplet/pages?page='+page+'&size='+size)
        .subscribe(result => {
          this.pageTemplet = result;
          this.templateDataTable = this.pageTemplet.results;
          this.totalRecords = this.pageTemplet.totalRecords;
        });
  }

  //选中节点事件
  nodeSelect(event){

  }

  //增加一级节点事件
  addPjNodeClick(node:TreeNodeModel){
      console.log('pj this.tmpTreeNodeArray.length:'+this.tmpTreeNodeArray.length);
      let parentIndex = null;
      if(node.parent){
        parentIndex = node.parent.menuIndex;
      }
      let menuIndex = this.tmpTreeNodeArray.length + 1;//this.treeNodeList.length + 1;
      let tempNode :TreeNodeModel = { label : '' ,data : {} ,expandedIcon : 'fa-folder-open' , collapsedIcon : 'fa-folder' ,children : [] ,edit : true , parent : node, sprite: 'folder',folderNeTp: '',menuIndex: menuIndex,parentIndex:parentIndex };
      if(node.parent){
        node.parent.children.push(tempNode);
      }else{
        this.treeNodeList.push(tempNode);
      }
      this.tmpTreeNodeArray.push(tempNode);
  }

  //点击增加子节点事件
  addNodeClick(node:TreeNodeModel){
    console.log('ch this.tmpTreeNodeArray.length:'+this.tmpTreeNodeArray.length);
    console.log('node.menuIndex:'+node.menuIndex);
    console.log('node.label:'+node.label);
      node.expanded = true;
      let parentIndex = node.menuIndex;
      let menuIndex = this.tmpTreeNodeArray.length + 1;
      let tempNode :TreeNodeModel = { label : '' ,data : {} ,expandedIcon : 'fa-folder-open' , collapsedIcon : 'fa-folder' ,children : [] ,edit : true ,parent : node, sprite: 'folder',folderNeTp: '',menuIndex:menuIndex,parentIndex:parentIndex };
      node.children.push(tempNode);
      this.tmpTreeNodeArray.push(tempNode);
  }

  //点击修改节点事件
  editNodeClick(node:TreeNodeModel){
    node.edit = true;
  }

  setNodeProperties(node:TreeNodeModel){
    this.editMenuDisplay = true;
  }

  editMenuProperties(){
    this.selectedNode.data = this.tmpSelectedNode.data;
    if(this.checked){
      this.selectedNode.folderNeTp = this.tmpSelectedNode.folderNeTp;
      // this.tmpKpiStr.toString().split(',').forEach(kpicode =>{
      let tmpAddIndex = 1;
      this.tmpKpiStr.forEach(kpicode =>{
        this.selectedNode.expanded = true;
        let parentIndex = this.selectedNode.menuIndex;
        console.log('editMenuProperties this.tmpTreeNodeArray.length:'+this.tmpTreeNodeArray.length);
        let menuIndex = this.tmpTreeNodeArray.length + tmpAddIndex;
        console.log('editMenuProperties parentIndex:'+parentIndex);
        console.log('editMenuProperties menuIndex:'+menuIndex);
        let tempNode : TreeNodeModel = { label : kpicode , data : {} , expandedIcon : 'fa-folder-open' , collapsedIcon : 'fa-folder' , edit : false , parent : this.selectedNode, sprite: 'kpi', folderNeTp: '', menuIndex: menuIndex, parentIndex: parentIndex };

        this.selectedNode.children.push(tempNode);
        this.tmpTreeNodeArray.push(tempNode);
        // tmpAddIndex++;
        this.checked = false;
        this.tmpSelectedNode = {};
        this.tmpKpiStr = [];
        this.editMenuDisplay=false;
      });
    }
  }

  closeEditProperties(){
    this.tmpSelectedNode = {};
    this.editMenuDisplay=false;
  }

  saveTemplateChange(){
    this.addOrEditTemplateDisplay = true;
    this.treeToArray(this.treeNodeList);
    if (this.treeNodeArray.length==0){
      this.showInfo('fail','create model tree first');
    }
    else if (this.templateNameInDialog == undefined || this.templateNameInDialog == '' ){
      // this.showInfo('fail','missing template name');
      this.showModelNameError = 'Please Input the Template Name';
    }
    else{
      this.templeVo.templetId = this.templateId;
      this.templeVo.templetName = this.templateNameInDialog;
      this.templeVo.templetDesc = this.templateDescInDialog;
      this.templeVo.menukpis = this.treeNodeArray;

      this.reportCommonService.saveDatasWithoutHeader(this.STAT_ENDPOINT + '/templet/dhssreport/merge',this.templeVo)
          .subscribe(result => {
            this.authService.appendLogWithContent('/workspace/report/define', 'reportDefine', 'add or update template:'+this.templeVo.templetName).subscribe(result => {}, error => { });
            this.treeNodeArray = [];
            this.tmpTreeNodeArray = [];
            this.loadTemplets(this.page, this.size);
            this.templateId = null;
            this.addOrEditTemplateDisplay = false;
            this.showInfo('success', 'save success');
          });
    }

  }

  treeToArray(nodes: TreeNodeModel[]){
    nodes.forEach(node => {
      let ele: TreeArrayModel = {};
      ele.label = node.label;
      // ele.data = node.data;
      ele.desc = node.desc;
      ele.id = node.id;
      ele.pId = node.pId;
      ele.indexId = node.indexId;
      ele.sprite = node.sprite;
      ele.folderNeTp = node.folderNeTp;
      ele.menuIndex = node.menuIndex;
      ele.parentIndex = node.parentIndex;
      this.treeNodeArray.push(ele);
      if (node.children && node.children.length>0){
        this.treeToArray(node.children);
      }
    });
  }

  treeToTmpArray(nodes: TreeNodeModel[]){
    nodes.forEach(node => {
      let ele: TreeArrayModel = {};
      ele.label = node.label;
      // ele.data = node.data;
      ele.desc = node.desc;
      ele.id = node.id;
      ele.pId = node.pId;
      ele.indexId = node.indexId;
      ele.sprite = node.sprite;
      ele.folderNeTp = node.folderNeTp;
      ele.menuIndex = node.menuIndex;
      ele.parentIndex = node.parentIndex;
      this.tmpTreeNodeArray.push(ele);
      console.log(node.children);
      if (node.children && node.children.length>0){
        this.treeToTmpArray(node.children);
      }
    });
  }

  //点击删除节点事件
  removeNodeClick(node: TreeNodeModel) {
      let parentNode = node.parent;
      parentNode.children.splice(parentNode.children.indexOf(node), 1);
      this.showInfo('success', 'delete success');
  }

  searchParentNode(parentIndex){
    this.treeNodeList.forEach(node => {
      if ( node.menuIndex == parentIndex ) {
        return node;
      }
    });
  }

  //编辑节点
  keyUpUpdateNodeInput(event, node : TreeNodeModel){
      if ( event.keyCode && event.keyCode == 13 ) {
        node.data = node.label;
        node.edit = false;
      }
  }

  clickUpdateNode(node : TreeNodeModel){
      node.data = node.label;
      node.edit = false;
  }

  //展开节点事件
  onNodeCollapse(event){
      console.log(event.node);
  }

  showInfo(type, message) {
        this.msgs = [];
        this.msgs.push({severity : type, summary : 'Message', detail : message});
  }

  templateDataTable = [];
  totalRecords: number;
  templateTextDisplay: boolean = false;
  addOrEditTemplateDisplay: boolean = false;
  templateNameInDialog: string;
  templateDescInDialog: string;
  selectedValue: string;
  templateId: number;

  treeNodeList : TreeNodeModel[] = [];
  selectedNode : TreeNodeModel = {};
  tmpSelectedNode : TreeNodeModel = {};
  items : MenuItem[] = [];
  templeVo : TempleVo = {};
  tmpKpis : TreeNodeModel[] = [];
  kpis : TreeNodeModel[] = [];
  tmpKpiStr : string[];
  kpisOptions = [];
  treeNodeArray : TreeArrayModel[] = [];
  tmpTreeNodeArray : TreeNodeModel[] = [];

  menukpivo : MenuKpiVo = {};

  checked: boolean = false;
  editMenuDisplay: boolean = false;

  page : number = 0;
  size : number = 0;
  pageTemplet: PageTemplet = {};

  statVo : StatVo = {};

  templetDesc : TempletDesc = {};

  showModelNameError = '';
}
