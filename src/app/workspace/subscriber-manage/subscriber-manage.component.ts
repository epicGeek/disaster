import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriberManageService } from './subscriber-manage.service';

@Component({
  selector: 'ices-subscriber-manage',
  templateUrl: './subscriber-manage.component.html',
  styleUrls: ['./subscriber-manage.component.css']
})
export class SubscriberManageComponent implements OnInit, OnDestroy {

  constructor(private subscriberManageService: SubscriberManageService,
              private router: Router) { }

  apiUrl: String = '';

  commandList: any;

  cmdTypeList: any;

  selectedCommand: any = null;

  msgs: any = [];

  editExecCommandDisplay: Boolean = false;

  radioValue: String = '0';

  modelKeySet = [];

  execCommandList = [];

  templateName = '';

  commandTemplateDisplay = false;

  commandTemplateText = [];

  helpInfo: String = '';

  paramStr: String = '';

  status: String = '';

  page: Number = 0;

  size: Number = 20;

  checkResultList = [];

  totalSize: Number = 0;

  statusColor = {'0': 'success', '1' : 'danger'};

  errorMessageDisplay = false;

  errorMessage = '';

  resultTypeList = [{ label: 'ALL' , value : ''},
                { label: 'SUCCESS' , value : '0'},
                { label: 'FAIL' , value : '1'}];

  resultType = '';

  searchCount = 0;


  ngOnDestroy() {
      if (this.searchCount !== 0) {
            this.searchCount = 0;
            this.searchResultTime = window.clearInterval(this.searchResultTime);
      }
  }

  resultClick(item) {
        if (item.exeResults === '0') {
            this.router.navigate(['workspace/single/user/query', {number: item.userNumber}]);
        }else {
            this.errorMessage = item.errorMessage;
            this.errorMessageDisplay = true;
        }
  }

  getCheckSubtoolResult(event) {
      this.subscriberManageService.findCheckSubtoolResult(this.paramStr, this.status,
                    event.first / event.rows, event.rows).subscribe(result => {
        this.checkResultList = result['_embedded']['check-subtool-result'];
        this.totalSize = result['page']['totalElements'];
      });
  }

  searchResultList() {
      this.getCheckSubtoolResult({first : 0 , rows : 20});
  }

  commitExec() {
      this.execCommandList = [];
      this.templateName = '';
      this.apiUrl = this.subscriberManageService.apiURL + '/sub/upload/template';
      this.modelKeySet = [];
      this.commandTemplateDisplay = false;
      if (this.selectedCommand) {
          this.radioValue = '0';
          this.editExecCommandDisplay = true;
          if (this.selectedCommand['params']) {
              const keySet = this.selectedCommand['params'].split(',');
              const defaultParamValues = this.selectedCommand['defaultParamValues'];
              const valueSet = (defaultParamValues ? defaultParamValues : '').split(',');
              let i = 0;
              keySet.forEach(element => {
                  this.modelKeySet.push({ key : element , value : valueSet[i] , index : i + 1});
                  i++;
              });
              this.helpInfo = this.selectedCommand['remarks'];
          }else {
                this.commandTemplateDisplay = true;
                this.commandTemplateText = [this.selectedCommand['command']];
          }
      }else {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: 'Message', detail: 'Please select instruction'});
      }
  }

  onBasicUploadAuto(event) {
      this.execCommandList = JSON.parse(event.xhr.responseText);
      this.templateName = event.files[0]['name'];
  }

  exportTemplate() {
      // tslint:disable-next-line:no-trailing-whitespace
      this.subscriberManageService.exportTemplate(this.selectedCommand['params'], 
      this.selectedCommand['name'], this.selectedCommand['defaultParamValues']);
  }

  execCommand() {
     this.msgs = [];
     if (this.radioValue === '0') {
        this.commandTemplateText = [this.selectedCommand['command']];
        let empty = true;
        this.modelKeySet.forEach( item => {
            if (!item.value) {
                empty = false;
                this.msgs.push({severity: 'warn', summary: 'Message', detail: item.key + ' can not be empty'});
            }else {
                this.commandTemplateText[0] = this.commandTemplateText[0].
                replace(new RegExp(('[\$]' + item.index), 'gm'), item.value);
            }
        });
        if (empty) {
            this.commandTemplateDisplay = true;
        }
    }else {
        if (!this.templateName) {
            this.msgs.push({severity: 'warn', summary: 'Message', detail: 'import parameters'});
        }else if (this.execCommandList.length === 0) {
            this.msgs.push({severity: 'warn', summary: 'Message', detail: 'no parameters'});
        }else {
            this.commandTemplateText = [];
            this.execCommandList.forEach(item => {
                let command = this.selectedCommand['command'];
                const keys = Object.keys(item);
                keys.forEach(element => {
                    command = command.replace(new RegExp(('[\$]' + element), 'gm'), item[element]);
                });
                this.commandTemplateText.push(command);
            });
            this.commandTemplateDisplay = true;
        }
    }
  }
  // tslint:disable-next-line:member-ordering
  searchResultTime;
  sendCommand() {
      this.searchResultTime = window.clearInterval(this.searchResultTime);
      this.msgs = [];
      if (this.commandTemplateText.length !== 0) {
            this.subscriberManageService.sendCommand(this.selectedCommand['name'], this.commandTemplateText)
            .subscribe(result => {
                const keys = Object.keys(result);
                keys.forEach(item => {
                    if (result[item] === 0) {
                        this.msgs.push({severity: 'info', summary: 'Message', detail: 'Done'});
                        // if (this.selectedCommand['command'].indexOf('subtool') === -1) {
                        console.log(this.searchCount);
                        this.searchResultTime = setInterval(() => {
                            this.searchResultList();
                            console.log(this.searchCount);
                            this.searchCount ++;
                            if (this.searchCount === 10) {
                                this.searchCount = 0;
                                this.searchResultTime = window.clearInterval(this.searchResultTime);
                            }
                        }, 5000);
                        // }
                    }
                    if (result[item] === -1) {
                        this.msgs.push({severity: 'warn', summary: 'Message', detail: 'MSISDN or IMSI was not found in the command'});
                    }
                    if (result[item] === 1) {
                        this.msgs.push({severity: 'error', summary: 'Message', detail: 'Execution exception'});
                    }
                    if (result[item] === 2) {
                        this.msgs.push({severity: 'warn', summary: 'Message', detail: 'No proper IP was found'});
                    }
                });
                this.searchResultList();
                this.editExecCommandDisplay = false;
            });
      }
  }

  ngOnInit() {
      this.subscriberManageService.getCommandList()
      .subscribe(result => {
          this.commandList = result;
      });
      this.subscriberManageService.getCmdType()
      .subscribe(result => {
          result.forEach(element => {
            element['label'] = element['subCommandName'];
            element['value'] = element['subCommandCode'];
          });
          this.cmdTypeList = [{ label : 'ALL' , value : null}].concat(result);
      });
  }

}
