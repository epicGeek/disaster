import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from './../../auth/api.config';



@Injectable()
export class AhubConnInfoService {
  apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }


  findData(): Observable<AhubConnInfo[]> {

    return this.http.get(this.apiURL + '/ahub-conn-info')
    .map( result => result.json()['_embedded']['ahub-conn-info'] || [])
    .catch(this.handleError);
  }

  getDropdownInfo(): Observable<any> {
    return this.http.get(this.apiURL + '/init-select')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  downloadTemplate() {
    // const params = '&token=' + localStorage.getItem('token');
    window.open(this.apiURL  + '/ahub-info/template-download');
  }

  getUploadUrl(): string {
    return this.apiURL + '/ahub-info/upload-template';
  }

  exportData() {
    window.open(this.apiURL + '/ahub-info/all-ahub-info-download');
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

export interface AhubConnInfo {
  selfPort?: string;
  targetMode?: string;
  targetLan?: string;
  vlanId?: string;
  ipAddress?: string;
  targetEquipment?: string;
  targetPort?: number;
  upLinkIpAddress?: string;
  ahubName?: string;
}
