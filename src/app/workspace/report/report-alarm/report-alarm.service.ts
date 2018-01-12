import { Injectable } from '@angular/core';

@Injectable()
export class ReportAlermService {

  constructor() { }

}

export interface AlermVo{
  id?:number;
  alermName?:string;
  createTime?:string;
}

export interface PageHistory{
  dataList?: AlermVo[];
  totalRecords?: number;
}
