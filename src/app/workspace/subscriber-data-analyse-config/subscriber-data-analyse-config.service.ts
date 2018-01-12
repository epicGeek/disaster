import { Injectable } from '@angular/core';
import { APIConfig } from '../../auth/api.config';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SubscriberDataAnalyseConfigService {
  subscriberApiEndPoint: string;
  constructor(private http: Http) {
    // alert(localStorage.getItem('apiConfig'));
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.subscriberApiEndPoint = apiConfig['subscriberDataURL'];
  }

  getAllTemplate(): Observable<any> {
    return this.http.get(this.subscriberApiEndPoint + '/all-subscriber-analysis-templates')
      .map(resultData => {
        return resultData.json();
      }).catch(this.handleError);
  }

  downloadAnalysisTemplate(path): void {
    window.open(this.subscriberApiEndPoint + '/download-subscriber-analysis-templates?path=' + path);
  }

  deleteRecord(id): Observable<any> {

    return this.http.delete(this.subscriberApiEndPoint + '/delete-record?id=' + id).map(
      result => {

        return result.json();
      }).catch(this.handleError);
  }

  getUrl(): string {
    const uploader = localStorage.getItem('userMessage');
    const uploadUrl = this.subscriberApiEndPoint + '/upload-analysis-template?uploader=' + uploader;
    return uploadUrl;
  }
  useThisTemplate(id): Observable<any> {
    return this.http.patch(this.subscriberApiEndPoint + '/upgrade-template', id)
      .map(resultData => resultData.json()).catch(this.handleError);
  }
  resetTemplate(type): Observable<any> {
    return this.http.post(this.subscriberApiEndPoint + '/reset-template', type)
      .map(resultData => resultData.json()).catch(this.handleError);
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
