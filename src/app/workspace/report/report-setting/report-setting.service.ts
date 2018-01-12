import { Injectable } from '@angular/core';

@Injectable()
export class ReportSettingService {

  constructor() { }

}

export interface CommTemplet{
  id?:number;
  modalTitle?:string;
  allNeContent?:string;
  hisContent?:string;
}
