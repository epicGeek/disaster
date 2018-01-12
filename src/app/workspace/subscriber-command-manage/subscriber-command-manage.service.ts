import { Injectable } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIConfig } from '../../auth/api.config';


@Injectable()
export class SubscriberCommandManageService {

  private apiURL = '';
  constructor(private http: Http) { 
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }

  saveSubscriberCommandGroupResource(item): Observable<any> {
    return this.http.post(this.apiURL + '/subscriber-command-group-resource', item)
    .map(result => result.json())
    .catch(this.handleError);
}

findSubscriberCommandGroupList(): Observable<any> {
    return this.http.get(this.apiURL + '/commandResource/subCommandGroup')
    .map( result => result.json())
    .catch(this.handleError);
}

findSubscriberCommandGroupResource(group): Observable<any> {
    return this.http.get(this.apiURL + '/subscriber-command-group/search/findByGroupIdEquals?q='+group)
    .map( result => result.json()['_embedded']['subscriber-command-group'] || [])
    .catch(this.handleError);
}

saveSubscriberCommand(item: SubscriberCommandManage): Observable<SubscriberCommandManage[]> {
  if (item['_links'])  {
    return this.http.patch(this.apiURL + '/subcriber-command/' + item['itemId'], item)
    .map(result => result.json())
    .catch(this.handleError);
  } else {
    return this.http.post(this.apiURL + '/subcriber-command', item)
    .map( result => result.json())
    .catch(this.handleError);
  }

}

removeCheckItem(item:SubscriberCommandManage):Observable<SubscriberCommandManage[]>{
  return this.http.delete(this.apiURL + '/subcriber-command/' + item['itemId'])
  .map( result => result.json())
  .catch(this.handleError);
}

findSubscriberCommand(): Observable<SubscriberCommandManage[]> {
  return this.http.get(this.apiURL + '/subcriber-command')
  .map( result => result.json()['_embedded']['subcriber-command'] || [])
  .catch(this.handleError);
}

findSubscriberCommandCategory(): Observable<any[]> {
  return this.http.get(this.apiURL + '/resource/sub_command_type')
  .map( result => result.json() || [])
  .catch(this.handleError);
}

// 错误信息的回调方法
private handleError (error: Response | any) {
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

export interface SubscriberCommandManage {
  id?: number;
  itemId?: number;
  category?: string;
  command?: string;
  defaultParamValues?: string;
  name?: string;
  params?: string;
  remarks?: string;
}
