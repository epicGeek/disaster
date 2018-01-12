import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class MultiUserQueryService {
  importFile: any;
  subscriberApiEndPoint: string;
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.subscriberApiEndPoint = apiConfig['subscriberDataURL'];
  }
  query(numberString, userName): Observable<any> {
    return this.http.get(this.subscriberApiEndPoint + '/multi-query-input?userName='+userName+'&numberString=' + numberString)
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  getUploadUrl():string{
    let user = localStorage.getItem("userMessage");
    return this.subscriberApiEndPoint +"/multi-query-upload-template?userName="+user;
  }
  downloadTemplate(): void {
    window.open(this.subscriberApiEndPoint + "/downloadTemplate");

  }

  downloadExcel(path): void {
    window.open(this.subscriberApiEndPoint + "/downloadExcelByPath?path=" + path);
  }


  getAllUserDataLog(): Observable<any> {
    return this.http.get(this.subscriberApiEndPoint + '/get-user-log-multi-new')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  //错误信息的回调方法
  private handleError(error: Response | any) {
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
