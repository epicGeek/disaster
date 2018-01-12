import { Injectable } from '@angular/core';

import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { TokenModel } from './token-model';

import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  tokenModel: TokenModel;
  showUserProfileBar: Boolean;
  errorMessage: string;
  createTime: Date;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  authServiceEndpointURL: string;
  logEndpointURL: string;
  constructor(private http: Http, private router: Router) {
    this.createTime = new Date();
  }

  login(user: {}): Observable<TokenModel> {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.authServiceEndpointURL = apiConfig['apiURL'];

    return this.http.post(this.authServiceEndpointURL + '/token', user)
      .map(res => {
        this.tokenModel = res.json() || {} as TokenModel;
        return this.tokenModel;
      })
      .catch(this.handleError);
    // return Observable.of(this.tokenModel);
  }

  private checkMenuError(error: Response | any) {
    return Observable.of(false);
  }

  checkMenu(token): Observable<boolean> {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.authServiceEndpointURL = apiConfig['apiURL'];
    const currentMenu = localStorage.getItem('currentMenuItem');
    // console.log(url);
    if (this.authServiceEndpointURL && currentMenu ) {
      return this.http.get(this.authServiceEndpointURL + '/menu-check?menuFlag=' + JSON.parse(currentMenu)['menu_flag'])
      .map(result =>  {
        const checkResult = result.json();
        localStorage.setItem('url', '/login');
        if (!checkResult['status'] && checkResult['message']) {
            alert(checkResult['message']);
            localStorage.setItem('url', '');
        }
        if (checkResult['isAlart']) {
            alert(checkResult['message']);
            localStorage.removeItem('url');
        }
        return checkResult['status'];
      }).catch(this.checkMenuError);
    }else {
      return this.http.get(this.authServiceEndpointURL + '/checkToken/' + token)
      .map(result => result.json())
      .catch(this.handleError);
    }
  }

  checkToken(token): Observable<boolean> {
    const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    this.authServiceEndpointURL = apiConfig['apiURL'];
    return this.http.get(this.authServiceEndpointURL + '/checkToken/' + token)
      .map(result => result.json())
      .catch(this.handleError);
  }
  getToken(): TokenModel {
    return this.tokenModel || JSON.parse(localStorage.getItem('token'));
  }
  getGlobalUrl(): Observable<any> {
    return this.http.get(this.authServiceEndpointURL + '/resource/global_url')
      // .retryWhen(error => error.delay(500))
      // .timeout(2000, new TimeoutError('delay exceeded')) // <------
      .map(result => {
        const global_url_map = {};
        result.json().forEach(element => {
          global_url_map[element['apiName']] = element['apiURL'];
        });
        localStorage.setItem('global_url_map', JSON.stringify(global_url_map));
        return '';
      })
      .catch(this.handleError);
  }
  getAPIUrl(): Observable<any> {
    return this.http.get('/config/api-config.json')
      .map(result => result.json())
      .catch(this.handleError);
  }

  private handleTokenModel(result: Response): TokenModel {
    const body = result.json();
    this.tokenModel = body;
    return this.tokenModel;
  }
  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    let todo: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    if (error.status === 0) {
      errMsg = 'Can\'t Access Auth Server';
      todo = 'Please Contract the Administrator';
    }
    return Observable.throw({ 'errorMessage': errMsg, 'todo': todo });
  }
  private createAuthorizationHeader(headers: Headers, token: string) {
    headers.append('ices-token', token);
  }
  logout(): Observable<any> {
    const removeUrl = this.authServiceEndpointURL + '/removeToken';
    return this.http.delete(removeUrl)
      .map(result => {
        // console.log(result);
        return result.json();
      })
      .catch(this.handleError);



    // let headers = new Headers();
    // // this.tokenModel = JSON.parse(localStorage.getItem('token'));
    // // headers.append('ices-token',this.tokenModel.token);
    // headers.append('content-type','text/uri-list');
    // return this.http.delete(this.authServiceEndpointURL+'/token',{ headers:headers })
    // .map(res => {
    //   this.tokenModel.token = '';
    //   return true;
    //  } )
    // .catch(this.handleError);
  }
  public appendLog(url: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userMessage');
    return this.http.post(this.logEndpointURL,
      { requestURL: url, token: token, user: userInfo })
      .map(result => result )
      .catch(this.handleError);
  }
  public appendLogWithContent(url: String, appModule: String , eventContent: String): Observable<any> {

    const apiURL = JSON.parse(localStorage.getItem('apiConfig'));
    this.logEndpointURL = apiURL['logURL'];
    const menuModel = JSON.parse(localStorage.getItem('currentMenuItem'));
    if (appModule !== 'Login' && appModule !== 'pwd') {
        url = menuModel['linkAddress'] ? menuModel['linkAddress'] : url;
        appModule = menuModel['displayName'] ? menuModel['displayName'] : appModule;
    }
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userMessage');
    return this.http.post(this.logEndpointURL,
      { requestURL: url, token: token, user: userInfo , appName: 'DHSS', appModule: appModule, eventContent: eventContent})
    .map(result => result)
    .catch(this.handleError);
  }
}
