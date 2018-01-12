import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SingleUserQueryService {
  subscriberApiEndPoint: string;
  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.subscriberApiEndPoint = apiConfig['subscriberDataURL'];
  }

  queryUserData(params: string): Observable<any> {
    const userName = localStorage.getItem('userMessage');
    return this.http.get(this.subscriberApiEndPoint + '/subscriber-data/' + params + '/' + userName)
      .map(result => result.json())
      .catch(this.handleError);
  }
  readCachedFile(filePath, subscriberNumber, unitName): Observable<any> {
    return this.http.get(this.subscriberApiEndPoint +
      '/read-cached-file?filePath=' + filePath + '&subscriberNumber=' + subscriberNumber + '&unitName=' + unitName)
      .map(result => result.json())
      .catch(this.handleError);
  }
  getAllUserDataLog(): Observable<any> {
    return this.http.get(this.subscriberApiEndPoint + '/get-user-log-new')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }
  downloadExcel(path): void {
    window.open(this.subscriberApiEndPoint + '/downloadExcelByPath?path=' + path);
  }

  // 错误信息的回调方法
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
