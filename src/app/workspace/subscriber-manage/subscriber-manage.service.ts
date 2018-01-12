import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Injectable()
export class SubscriberManageService {

  public apiURL = '';
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig['apiURL'];
  }

  findCheckSubtoolResult(checkName, status, page, size) {
      return this.http.get(this.apiURL + 
        '/check-subtool-result/search/findCheckSubtoolResultResult?checkName=' + checkName
        + '&status=' + status + '&page=' + page + '&size=' + size + '&sort=createTime,desc').map(result => {
            return result.json();
        }).catch(this.handleError);
  }

  sendCommand(checkName, commandList) {
     return this.http.post(this.apiURL + '/sub/sendCommand',
     { commandList : commandList , checkName : checkName , userName : localStorage.getItem('userMessage')})
     .map(result => result.json())
     .catch(this.handleError);
  }

  exportTemplate(title, name , defaultParamValues) {
      location.href = this.apiURL + '/export-template/download?title=' +
            title + '&name=' + name + '&defaultValue=' + defaultParamValues;
  }

  getCommandList(): Observable<any> {
    return this.http.get(this.apiURL + '/search/subscriber-command-list/subCommandGroup')
    .map(result => {
        return result.json();
    }).catch(this.handleError);
  }

  getCmdType(): Observable<any> {
      return this.http.get(this.apiURL + '/resource/sub_command_type')
      .map(result => result.json())
      .catch(this.handleError);
  }


  // 错误信息的回调方法
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

}
