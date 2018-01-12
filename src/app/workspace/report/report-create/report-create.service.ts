import { Injectable } from '@angular/core';

@Injectable()
export class ReportCreateService {

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

export interface ProcessPo{
  transIsEnd?:string;
	transStop?:string;
	transTask?:string;
	transTotalNum?:string;
	transCurNum?:string;
	transCurObj?:string;
	transFrom?:string;
	transTo?:string;
	sessionId?:string;
}

export interface HistoryVo{
  execTime?:string;
  person?:string;
  desc?:string;
  mrId?:string;
  docType?:string;
  endTime?:string;
  hasgs?:string;
  hashs?:string;
  hassn?:string;
  snapTime?:string;
  startTime?:string;
  templetId?:string;
  filePath?:string;
  fileName?:string;
  zipFilePath?:string;
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
