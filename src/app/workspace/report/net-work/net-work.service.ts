import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { columnvo } from './columnvo';

@Injectable()
export class NetWorkService {

  constructor(private http: Http) {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.STAT_ENDPOINT = apiConfig['reportURL'];
   }

  globalUrl = {};
  STAT_ENDPOINT = '';

  public getColumnsData(url):Observable<any[]>{
    return this.http.get(this.STAT_ENDPOINT + url)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public saveColumns(colNames,dbNames,editTableId):Observable<any>{
    let xformHeaders: Headers = new Headers();
    xformHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions ({ headers: xformHeaders} );

    const saveParams = new URLSearchParams();
    saveParams.append('colNames', colNames);
    saveParams.append('dbNames', dbNames);
    if(editTableId){
      saveParams.append('editTableId', editTableId);
    }

    return this.http.post(this.STAT_ENDPOINT + '/templet/dhssGsTable/edit',saveParams,options)
    .map(result => {console.log('post result::::::'+result.text());return result.json();})
    .catch(this.handleError);;
  }

  public deleteTable(tableId):Observable<any>{
    let xformHeaders: Headers = new Headers();
    xformHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions ({ headers: xformHeaders} );

    const saveParams = new URLSearchParams();
    saveParams.append('tableId', tableId);

    return this.http.post(this.STAT_ENDPOINT + '/templet/table/delete',saveParams,options)
    .map(result => {console.log('post result::::::'+result.text());return result.json();})
    .catch(this.handleError);;
  }

  public saveTableOrder(tableOrderStr){
    let xformHeaders: Headers = new Headers();
    xformHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions ({ headers: xformHeaders} );

    const saveParams = new URLSearchParams();
    saveParams.append('tableIdsStr', tableOrderStr);

    return this.http.post(this.STAT_ENDPOINT + '/templet/gstable/seq/edit',saveParams,options)
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

export interface DhssColumnsVo{
  label?:string;
  value?:string;
}

export interface GsTableVo{
  tableId?:number;
  data?:DhssColumnsVo[];
}
