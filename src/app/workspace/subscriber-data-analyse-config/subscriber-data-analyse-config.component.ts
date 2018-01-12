import { Component, OnInit } from '@angular/core';
import { TooltipModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, SelectItem, GrowlModule, Message } from 'primeng/primeng';
import { SubscriberDataAnalyseConfigService } from './subscriber-data-analyse-config.service';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'ices-subscriber-data-analyse-config',
  templateUrl: './subscriber-data-analyse-config.component.html',
  styleUrls: ['./subscriber-data-analyse-config.component.css']
})
export class SubscriberDataAnalyseConfigComponent implements OnInit {

  constructor(private subscriberDataAnalyseConfigService: SubscriberDataAnalyseConfigService,
    private confirmationService: ConfirmationService,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.getAllTemplateInfo();
  }

  upload() {
    this.uploadDisplay = true;
  }

  downloadTemplate(path) {

    this.subscriberDataAnalyseConfigService.downloadAnalysisTemplate(path);
  }

  deleteRecord(analyseTemplate) {
    this.subscriberDataAnalyseConfigService.deleteRecord(analyseTemplate.id).subscribe(
      resultData => {
        this.getAllTemplateInfo();
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Confirmed', detail: 'Record deleted' });
        const logContent = 'Remove subscriber analysis template :' + analyseTemplate.templateFilePath;
        this.authService.appendLogWithContent('', '', logContent)
          .subscribe(logResult => { }, error => { });
      }
    );
  }

  confirmDelete(analyseTemplate) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      header: 'Delete',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteRecord(analyseTemplate);
      }
    });
  }
  confirmResetTemplate(template) {
    this.confirmationService.confirm({
      message: 'Are you sure to restore the factory settings for the ' + template.templateType + ' template?',
      header: 'Delete',
      icon: 'fa fa-trash',
      accept: () => {
        this.resetTemplate(template.templateType);
      }
    });
  }
  resetTemplate(type) {
    this.subscriberDataAnalyseConfigService.resetTemplate(type).subscribe(
      resultData => {
        this.getAllTemplateInfo();
        this.msgs = [];
        this.msgs.push({ severity: resultData.severity, summary: resultData.summary, detail: resultData.detail });

      }
    );
  }

  getAllTemplateInfo() {
    this.subscriberDataAnalyseConfigService.getAllTemplate().subscribe(
      resultData => {

        this.uploadRecords = resultData['notInUse'];
        this.templatesInUseArray = resultData['inUse'];
        if (this.templatesInUseArray.length === 0) {
          this.getAllTemplateInfo();
        }
      }
    );
  }


  onUpload(event) {
    this.uploadDisplay = false;
    this.getAllTemplateInfo();
  }
  useThisTemplate(analyseTemplate) {
    console.log(analyseTemplate.id);
    this.subscriberDataAnalyseConfigService.useThisTemplate(analyseTemplate.id)
      .subscribe(resultData => {
        console.log(resultData);
        this.getAllTemplateInfo();
        this.msgs = [];
        this.msgs.push({ severity: resultData.severity, summary: resultData.summary, detail: resultData.detail });
      });

  }

  msgs: Message[] = [];
  templatesInUseArray = [];
  uploadRecords = [];
  uploadDisplay: boolean = false;
  totalRecords: number;
  uploadUrl: string = this.subscriberDataAnalyseConfigService.getUrl();
}
