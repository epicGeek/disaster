import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions , RequestOptionsArgs } from '@angular/http';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {

  constructor() {
    super();
  }
  merge(options?: RequestOptionsArgs): RequestOptions {
    const newOptions = super.merge(options);
    newOptions.headers.append('Ices-Access-Token', localStorage.getItem('token'));
    return newOptions;
  }
}

export const requestOptionsProvider = { provide: RequestOptions, useClass: DefaultRequestOptions };
