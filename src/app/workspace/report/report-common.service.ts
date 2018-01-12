import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ReportCommonService {

  constructor(private http: Http, private authService: AuthService) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.STAT_ENDPOINT = apiConfig['reportURL'];
   }

  globalUrl = {};
  STAT_ENDPOINT = '';

  public getRemoteData(url):Observable<any[]>{
    return this.http.get(url)
      .map((response: Response) => {console.log('response.text():'+response.text());return response.json()})
      .catch(this.handleError);
  }

  public saveDatasWithXform(url, saveParams: URLSearchParams):Observable<any>{
    let xformHeaders: Headers = new Headers();
    xformHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions ({ headers: xformHeaders} );

  //  this.authService.appendLogWithContent(
  //    url, 'report config', saveParams.toString())
  //    .subscribe(result => { }, error => { });
    return this.http.post(url,saveParams,options)
    .map(result => {console.log('post result::::::'+result.text());return result.json();})
    .catch(this.handleError);
  }

  public saveDatasWithJson(url, jsonModal):Observable<any>{
    let headers = new Headers();//{'Content-Type': 'application/json'}
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions ({ headers: headers} );
console.log('in savedataswith');
    console.log('jsonModal:'+jsonModal);
    console.log('url:' + url);

    // this.authService.appendLogWithContent(
    //   url, 'report config', JSON.stringify(jsonModal))
    //   .subscribe(result => { }, error => { });
    return this.http.post(url,jsonModal,options)
    .map(result => {console.log('post result::::::'+result.text());return result.json();})
    .catch(this.handleError);;
  }

  public saveDatasWithoutHeader(url, jsonModal): Observable<any>{

    // this.authService.appendLogWithContent(url, 'report config', JSON.stringify(jsonModal)).subscribe(result => { }, error => { });

    return this.http.post(url,jsonModal)
    .map(result => {console.log('post result::::::'+result.text());return result.json();})
    .catch(this.handleError);;
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    console.error(error);
    if (error instanceof Response) {
      const body = error.json() || '';

      const err = body.error || JSON.stringify(body);

      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

export interface StatVo{
  stat?:string;
  dataId?:number;
}
