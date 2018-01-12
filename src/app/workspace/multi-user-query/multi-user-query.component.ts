import { Component, OnInit, ElementRef } from '@angular/core';
import { MultiUserQueryService } from './multi-user-query.service';
import { ActivatedRoute, Params, Route } from '@angular/router';
import { Message } from 'primeng/primeng';
import * as moment from 'moment';
@Component({
  selector: 'app-multi-user-query',
  templateUrl: './multi-user-query.component.html',
  styleUrls: ['./multi-user-query.component.css']
})
export class MultiUserQueryComponent implements OnInit {
  msgs: Message[] = [];

  optionMsgs = [];
  totalRecords: number;
  constructor(private MultiUserQueryService: MultiUserQueryService, private route: ActivatedRoute) { }
  uploadUrl = this.MultiUserQueryService.getUploadUrl();

  showOptionMsgs(){
        this.optionMsgs = [];
        this.optionMsgs.push({severity:'warn', summary:'Warn Message', detail:'Type IMSI/MSISDN here and End with Enter'});
  }

  hideOptionMsgs(){
        this.optionMsgs = [];
  }

  ngOnInit() {

    this.MultiUserQueryService.getAllUserDataLog().subscribe(
      resultData => {
        this.multiQueryRecordTable = resultData;
      }
    )
    // this.showOptionMsgs();
  }
  query() {
    this.hideOptionMsgs();
    let user = localStorage.getItem("userMessage");
    this.MultiUserQueryService.query(this.numberString, user).subscribe(
      resultData => {

        if (resultData.multiQuerySuccess == false) {
          this.msgs.push({ severity: 'error', summary: 'Multi-subscriber data query failed!',
           detail: '1.Please check all input numbers or the template file is valid.\n 2.Please check whether the PGW-provisioning web service is available. 3.Please check whether if there are too many numbers.' });
        } else {
          this.msgs.push({ severity: 'success', summary: 'Multi-subscriber data query success!', detail: 'Query successfully!' });
          this.MultiUserQueryService.getAllUserDataLog().subscribe(
            resultData => {
              this.multiQueryRecordTable = resultData;
            }
          )
        }
      }
    );
  }
  downloadTemplate() {
    this.MultiUserQueryService.downloadTemplate();
  }

  afterUpload(event) {

    let response = JSON.parse(event.xhr.response);//json string ->json obj
    this.uploadDisplay = false;
    if (response.uploadSuccess == true) {

      if (response.multiQuerySuccess == false) {
        this.msgs.push({ severity: 'error', summary: 'Multi-subscriber data query failed!', detail: '1.Please check all input numbers or the template file is valid.\n 2.Please check whether the PGW-provisioning web service is available.' });
      } else {
        this.msgs.push({ severity: 'success', summary: 'Multi-subscriber data query success!', detail: 'Query successfully!' });
        this.MultiUserQueryService.getAllUserDataLog().subscribe(
          resultData => {
            this.multiQueryRecordTable = resultData;
          }
        )
      }
      //this.msgs.push({severity:'success', summary:'Upload file successfully!', detail:'Upload file successfully!'});
    } else {

      let errorInfo = response.errorInfo;
      this.msgs.push({ severity: 'error', summary: 'Upload file failed!', detail: 'Error info:' + errorInfo });
    }

  }
  showImportTemplate() {
    this.uploadDisplay = true;
  }

  downloadExcel(path) {
    this.MultiUserQueryService.downloadExcel(path);
  }
  numberString: string[];
  multiQueryRecordTable = [];
  id: string;
  uploadDisplay: boolean = false;

}
