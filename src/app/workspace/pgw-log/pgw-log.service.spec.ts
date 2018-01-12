/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PgwLogService } from './pgw-log.service';

describe('PgwLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PgwLogService]
    });
  });

  it('should ...', inject([PgwLogService], (service: PgwLogService) => {
    expect(service).toBeTruthy();
  }));
});
