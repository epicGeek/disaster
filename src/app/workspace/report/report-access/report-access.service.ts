import { Injectable } from '@angular/core';

@Injectable()
export class ReportAccessService {

  constructor() { }

}

export interface ManualOptionVo{
  id?:number;
  startTime?:string;
  endTime?:string;
  hasgs?:string;
  gsexcel?:string;
  hashs?:string;
  templetId?:number;
  comments?:string;
  sessionId?:string;
}

export interface HistoryVo{
  srId?:string;
  createTime?:string;
  name?:string;
  execStatus?:string;
  filePath?:string;
  fileName?:string;
  zipFilePath?:string;
  zipFileName?:string;
  taskResultInfo?:string;
}

export interface PageHistory{
  dataList?: HistoryVo[];
  totalRecords?: number;
}

export interface MailUserPo{
  userId?:string;
  userName?:string;
  phone?:string;
  email?:string;
  added?:string;
}

export interface SendMsgsInfo{
  manualReportId?:string;
  mailUserPos?:MailUserPo[];
}

export interface PageableVo{
  page?:number;
  pageSize?:number;
  totalCount?:number;
  totalRecords?:number;
  totalPage?:number;
  stat?:string;
  startTime?:string;
  endTime?:string;
  reportName?:string;
  runstat?:string;
  docType?:string;
  runrate?:string;
}
