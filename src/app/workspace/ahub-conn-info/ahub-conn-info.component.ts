import { Component, OnInit } from '@angular/core';
import { AhubConnInfoService } from './ahub-conn-info.service';
import { AuthService} from '../../auth/auth.service';
import { Message } from 'primeng/primeng';


@Component({
  selector: 'ices-ahub-conn-info',
  templateUrl: './ahub-conn-info.component.html',
  styleUrls: ['./ahub-conn-info.component.css']
})
export class AhubConnInfoComponent implements OnInit {

  constructor(private ahubConnInfoService: AhubConnInfoService, private authService: AuthService) {

  }

  ahubConnInfoList = [];

  selectUnit = '';

  unitList = [];

  uploadDisplay: boolean = false;

  msgs: Message[] = [];

  uploadUrl = this.ahubConnInfoService.getUploadUrl();
  
  totalRecords : number;
  
  ngOnInit() {
    this.getAhubData();
    this.getUnitData();
  }


  getAhubData() {
      this.ahubConnInfoService.findData().subscribe(result => {
          this.ahubConnInfoList = result;
          this.totalRecords = result.length;
      });
  }


  getUnitData() {
      this.ahubConnInfoService.getDropdownInfo().subscribe(result => {
        this.unitList = [{label: 'ALL UNIT', value: ''}];
        this.unitList = this.unitList.concat(result['unit']);
    });
  }


  downloadTemplate() {
    this.ahubConnInfoService.downloadTemplate();
  }

  showImportTemplate() {
    this.uploadDisplay = true;
  }
  test(dt){
    console.log(dt);
  }
  afterUpload(event) {
    this.msgs = [];
    this.uploadDisplay = false;
    this.getAhubData();
    let response = JSON.parse(event.xhr.response);//json string ->json obj
    console.log(response);
    this.msgs.push({severity:response.severity, summary:response.summary, detail:response.detail});
  }

  exportData() {
    this.ahubConnInfoService.exportData();
  }

}
