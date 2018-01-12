/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SystemOperationLogService } from './system-operation-log.service';

describe('SystemOperationLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemOperationLogService]
    });
  });

  it('should ...', inject([SystemOperationLogService], (service: SystemOperationLogService) => {
    expect(service).toBeTruthy();
  }));
});
