import { Injectable } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from '../../auth/api.config';


@Injectable()
export class CheckItemService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  getScriptType(): Observable<any> {
      return this.http.get(this.apiURL + '/resource/scriptType').map(result => {
          return result.json();
      }).catch(this.handleError);
  }

  saveGroupResource(item): Observable<any> {
      return this.http.post(this.apiURL + '/check-group-resource', item)
      .map(result => result.json())
      .catch(this.handleError);
  }

  findGroupList(): Observable<any> {
      return this.http.get(this.apiURL + '/commandResource/commandGroup')
      .map( result => result.json())
      .catch(this.handleError);
  }

  findGroupResource(group): Observable<any> {
      return this.http.get(this.apiURL + '/check-group/search/findByGroupIdEquals?q='+group)
      .map( result => result.json()['_embedded']['check-group'] || [])
      .catch(this.handleError);
  }

  saveCheckItem(item: CheckItem): Observable<CheckItem[]> {
    if (item['_links'])  {
      return this.http.patch(this.apiURL + '/command-check-item/' + item['itemId'], item)
      .map(result => result.json())
      .catch(this.handleError);
    } else {
      return this.http.post(this.apiURL + '/command-check-item', item)
      .map( result => result.json())
      .catch(this.handleError);
    }

  }

  removeCheckItem(item:CheckItem):Observable<CheckItem[]>{
    return this.http.delete(this.apiURL + '/command-check-item/' + item['itemId'])
    .map( result => result.json())
    .catch(this.handleError);
  }

  findCheckItem(): Observable<CheckItem[]> {
    return this.http.get(this.apiURL + '/command-check-item')
    .map( result => result.json()['_embedded']['command-check-item'] || [])
    .catch(this.handleError);
  }

  findCategory(): Observable<any[]> {
    return this.http.get(this.apiURL + '/resource/commandType')
    .map( result => result.json() || [])
    .catch(this.handleError);
  }

  findSubtoolType(): Observable<any[]> {
    return this.http.get(this.apiURL + '/subtool-cmd-type')
    .map( result => result.json()['_embedded']['subtool-cmd-type'] || [])
    .catch(this.handleError);
  }

  // 获取所有类型
  getTypes(): Observable<any[]> {
    return this.http.get(this.apiURL + '/resource/neUnitType').map(
      data => {
        return data.json() || [];
      }).catch(this.handleError);
  }

  // 执行lua测试
  execLuaService(item: CheckItem): Observable<any> {
      return this.http.post(this.apiURL + '/test-lua', item)
      .map( result => result.json())
      .catch(this.handleError);
  }

  getUploadUrl(): string {
    return this.apiURL + '/lua-test/upload-template';
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

export interface CheckItem {
  account?: string;
  category?: string;
  cmdType?: string;
  command?: string;
  defaultParamValues?: string;
  emsType?: string;
  itemId?: number;
  name?: string;
  params?: string;
  remarks?: string;
  script?: string;
  scriptParams?: string;
  applyUnit?: string;
  luaLog?: string;
  scriptType?: String;
}
