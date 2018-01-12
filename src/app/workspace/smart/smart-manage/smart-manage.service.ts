import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import '../../../rxjs-operator';
import { SmartCheckJob } from '../smart-model/smart-check-job';
import { EquipmentNe } from '../smart-model/equipment-ne';
import { APIConfig } from '../../../auth/api.config';

@Injectable()
export class SmartManageService {

  private apiURL = '';
  constructor(private http: Http) {
    const apiConfig: APIConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.apiURL = apiConfig.apiURL;
  }
  private headers = new Headers({'Content-Type': 'application/json', 'Ices-Access-Token': localStorage.getItem('token')});
  uriListHeaders = new Headers({'Content-Type': 'text/uri-list', 'Ices-Access-Token': localStorage.getItem('token')});
  // 每页数据集合
  content: SmartCheckJob[] = [];
  // 总数
  totalElements = 0;
  cars: any[] = [];

  // 立即执行
  execJob(item: SmartCheckJob): Observable<boolean> {
    return this.http.get(this.apiURL + '/execJob?id=' + item.id)
      .map(result => {
      return result.json();
    }).catch(this.handleError);
  }

  // 停止全部任务
  stopAll(): Observable<boolean> {
    return this.http.get(this.apiURL + '/smart-check-job/stopAll')
      .map(result => {
      return true;
    }).catch(this.handleError);
  }

  // 查询全部指令数据
  findAllCommandCheckItemList(): Observable<any[]> {
    return this.http.get(this.apiURL + '/search/check-list/commandGroup').map(result => {
      return result.json() || [];
    }).catch(this.handleError);
  }

  // 加入、移除单元和网元
  smartJobUnitAndItem(check: boolean, jobId: number, item: string, model: string): Observable<boolean> {
    let id = item;
    this.uriListHeaders = new Headers({
      'Content-Type': 'text/uri-list',
      'Ices-Access-Token': localStorage.getItem('token')
    });
    if (check) {

      return this.http.patch((this.apiURL + '/smart-check-job/' + jobId + '/' + model),
        (model + '/' + item), { headers: this.uriListHeaders })
        .map(ok => {
        return true;
      }).catch(this.handleError);
    } else {
      return this.http.delete(this.apiURL + '/smart-check-job/' + jobId + '/' + model + '/' + id)
        .map(ok => true).catch(this.handleError);
    }

  }

  // 获取所有网元
  getNeList(): Observable<EquipmentNe[]> {
    return this.http.get(this.apiURL + '/system-ne-list/net/1')
      .map(data => data.json())
      .catch(this.handleError);
  }

  // 获取所有单元
  getUnitList(): Observable<any[]> {
    return this.http.get(this.apiURL + '/query-equipment-unit-all/net/0')
      .map(data => data.json() || {})
      .catch(this.handleError);
  }

  // 获取所有类型
  getTypes(): Observable<any[]>{
    return this.http.get(this.apiURL + '/resource/neUnitType')
      .map(data => data.json() || [])
      .catch(this.handleError);
  }

  // 验证任务配置是否符合
  checkJob(id): Observable<boolean> {
    return this.http.get(this.apiURL + '/startJobCheck/' + id)
      .map(data => data.json() || false)
      .catch(this.handleError);
  }

  // 删除任务
  deleteItem(item: SmartCheckJob): Observable<Response> {
    return this.http.delete(this.apiURL + '/smart-check-job/' + item.id)
      .map((ok) => true)
      .catch(this.handleError);
  }

  // 保存或者修改
  preservationJob(item: SmartCheckJob): Observable<boolean> {
    item.execDay = moment(item.execDay).format('YYYY-MM-DD HH:mm:ss');
    item.nextDay = moment(item.execDay).format('YYYY-MM-DD HH:mm:ss');
    if (!item['id']) {
      return this.http.post(this.apiURL + '/smart-check-job', item)
        .map(this.data)
        .catch(this.handleError);
    } else {
      return this.http.patch(this.apiURL + '/smart-check-job/' + item.id, item)
        .map(this.data)
        .catch(this.handleError);
    }

  }

  // 保存或者修改的回调
  data(res: Response) {
      let body = res.json();
      return body['_links'] ? true : false;
  }

  // 获取每页数据的请求
  getJob(page: number, size: number, paramStr): Observable<Response> {
    return this.http.get(this.apiURL + '/smart-check-job/getPageSmartManage?page=' + page + '&size=' + size + '&params=' + paramStr)
      .map((res: Response) =>
      // tslint:disable-next-line:one-line
      {
        const body = res.json();
        this.content = body['content'];
        this.totalElements = body['totalElements'];
      }).catch(this.handleError);
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
