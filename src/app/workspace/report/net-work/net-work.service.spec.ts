/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NetWorkService } from './net-work.service';

describe('NetWorkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetWorkService]
    });
  });

  it('should ...', inject([NetWorkService], (service: NetWorkService) => {
    expect(service).toBeTruthy();
  }));
});
