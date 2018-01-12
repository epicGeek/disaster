import { Injectable } from '@angular/core';

@Injectable()
export class ReportMailService {

  constructor() { }

}

export interface MailUserPo{
  userId?:string;
  userName?:string;
  phone?:string;
  email?:string;
  added?:string;
}

export interface MailGroupVo{
  gid?:string;
  groupName?:string;
  added?:string;
  mailUserPos?:MailUserPo[];
  mailUserStri?:string;
}

export interface PageGroup{
  dataList?: MailGroupVo[];
  totalRecords?: number;
}

export interface MailUserGroupIdVo{
  groupId?:string;
  userId?:string;
}

export interface MailInterfaceInfo{
  id?:number;
  commandPath?:string;
  smscommandPath?:string;
  smsContent?:string;
}
