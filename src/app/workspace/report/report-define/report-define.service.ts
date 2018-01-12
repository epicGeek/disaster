import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  Http, URLSearchParams,
  Response, Headers, RequestOptions
} from '@angular/http';

@Injectable()
export class ReportDefineService {

  constructor(private http: Http) { }

  initTreeView() : TreeNodeModel[]{
    let nodes :TreeNodeModel[]= [{ label : 'Documents' , data : 'Documents Folder' , children : [] ,
                               expandedIcon : 'fa-folder-open' , collapsedIcon : 'fa-folder' , edit : false }];
    return nodes;
  }

}

export interface TreeNodeModel{
  // 节点显示的内容
  label?: string;
  // 节点value
  data?: {};
  // 节点收起的图标
  expandedIcon?: string;
  // 节点展开的图标
  collapsedIcon?: string;
  // 子节点
  children?: TreeNodeModel[];
  // 是否展开
  expanded?: boolean;
  // 是否是编辑状态
  edit?: boolean;
  // 上级节点
  parent?: TreeNodeModel;
  id?:number;
  pId?:number;
  desc?:string;
  indexId?:string;
  sprite?:string;
  folderNeTp?:string;
  menuIndex?:number;
  parentIndex?:number;
}

export interface TreeArrayModel{
  // 节点显示的内容
  label?: string;
  // 节点value
  data?: {};
  id?:number;
  pId?:number;
  desc?:string;
  indexId?:string;
  sprite?:string;
  folderNeTp?:string;
  menuIndex?:number;
  parentIndex?:number;
}

export interface TempleVo{
  templetId?:number;
  templetName?:string;
  templetDesc?:string;
  menukpis?:TreeArrayModel[];
}

export interface MenuKpiVo{
  id?:number;
  menuKpitext?:string;
  menuKpiSprite?:string;
  voIndex?:number;
  menuKpiDesc?:string;
  menuIndex?:number;
  parentIndex?:number;
  seq?:number;
  folderNeTp?:string;
  templetId?:number;
}

export interface TempletInfoVo{
  templetId?:number;
	templateName?:string;
	templateDescription?:string;
	createTime?:string;
	creator?:string;
}

export interface PageTemplet{
  results?: TempletInfoVo[];
  totalRecords?: number;
}

export interface StatVo{
  stat?:string;
  dataId?:number;
}

export interface TempletDesc{
  id?:number;
	modalTitle?:string;
	nargsTitle?:string;
	nargsContent?:string;
	gsTitle?:string;
	gsContent?:string;
	allNeContent?:string;
	hisContent?:string;
	templetId?:number;
	coverType?:string;
}
