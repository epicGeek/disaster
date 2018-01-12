import { Injectable } from '@angular/core';
import { APIConfig } from '../../auth/api.config';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NumberManageService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  findNumberListInGroup(groupId): Observable<any> {
      return this.http.get(this.apiURL + '/number-group/search/findListByGroupIdEquals?groupId=' + groupId)
      .map(result => {
        const numberIdList = [];
        const data = result.json()['_embedded']['number-group'];
        data.forEach(element => {
          numberIdList.push(element['numberId']);
        });
        return numberIdList;
      }).catch(this.handleError);
  }

  // private headers = new Headers({'Content-Type': 'application/json'});
  findData(item): Observable<Response> {
    console.log(item);
    let params = '?page=' + item.page;
    params = params + '&size=' + item.size;
    params = params + '&paramStr=' + item.paramStr;

    return this.http.get(this.apiURL + '/query-number-list' + params)
           .map( result => result.json()).catch(this.handleError);
  }

  findDataAll(): Observable<any> {

    return this.http.get(this.apiURL + '/query-number-list-all')
           .map( result => result.json()).catch(this.handleError);
  }

  removeData(item): Observable<any> {
    return this.http.delete(this.apiURL + '/number-section/' + item.id)
    .map( result => {
      return result.json();
    }).catch(this.handleError);
  }



  saveOrEditNumberSection(item): Observable<String> {
   if (item.id) {
    return this.http.patch(this.apiURL + '/number-section/' + item.id, item)
            .map(this.data).catch(this.handleError);
   } else {
    return this.http.post(this.apiURL + '/number-section', item)
            .map(this.data).catch(this.handleError);
   }
 }

  saveNeResource(postData): Observable<Object> {

    return this.http.post(this.apiURL + '/number-ne-save', postData)
    .map(result => result.json())
    .catch(this.handleError);
  }

 findNeList(): Observable<any> {
      return this.http.get(this.apiURL + '/role/resource/net')
      .map( result => result.json() )
      .catch(this.handleError);
  }

  findOptionalNeNumberResource(): Observable<any> {
      return this.http.get(this.apiURL + '/number-ne-optional')
      .map( result => result.json() || [])
      .catch(this.handleError);

  }
  findSelectNeNumberResource(neId): Observable<any> {
     return this.http.get(this.apiURL + '/ne-group/search/findNeGroupByNeIdEquals?neId=' + neId)
      .map( result => {
        const neIdList = [];
        const data = result.json()['_embedded']['ne-group'];
        data.forEach(element => {
          neIdList.push(element['numberId']);
        });
        return neIdList;
      }).catch(this.handleError);
  }

  saveGroupResource(postData): Observable<Object> {

    return this.http.post(this.apiURL + '/number-group-save', postData)
    .map(result => result.json())
    .catch(this.handleError);
  }

 findGroupList(): Observable<any> {
      return this.http.get(this.apiURL + '/role/resource/number_group')
      .map( result => result.json())
      .catch(this.handleError);
  }


  // 保存或者修改的回调
  data(res: Response) {
      const body = res.json();
      return body['_links'] ? true : false;
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

export interface NumberSection {
  imsi?: String;
  number?: String;
  groupId?: number;
  neId?: number;
}
