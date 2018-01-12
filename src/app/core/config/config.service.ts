import { Injectable } from '@angular/core';

import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigService {

  constructor(private http: Http) { }

  getAPIUrl(): Observable<any> {
    return this.http.get('/config/api-config.json')
      .map(result => result.json())
      .catch( this.handleError );
  }
  private handleError(error: Response | any) {
    return Observable.throw({ 'errorMessage': error });
  }
}
