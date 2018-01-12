import { Injectable } from '@angular/core';

@Injectable()
export class TaskConfigService {

  constructor() { }

}

export interface MailUserPo{
  userId?:string;
  userName?:string;
  phone?:string;
  email?:string;
  added?:string;
}

export interface TaskJob{
  id?:string;
  createTime?:string;
  runrate?:string;
  templetId?:number;
  docType?:string;
  description?:string;
  hasgs?:string;
  gsexcel?:string;
  hashs?:string;
  hassn?:string;
  mailUserPos?:MailUserPo[];
}

export interface HistoryVo{
  jobId?:string;
  taskName?:string;
  taskDesc?:string;
  person?:string;
  startTime?:string;
  period?:string;
  nextExecTime?:string;
  status?:string;
  templetId?:string;
  docType?:string;
  hasgs?:string;
  gsexcel?:string;
  hashs?:string;
  hassn?:string;
  mailUserIds?:string;
}

export interface PageHistory{
  dataList?: HistoryVo[];
  totalRecords?: number;
}
