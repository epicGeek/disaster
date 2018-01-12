/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReportAccessService } from './report-access.service';

describe('ReportAccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportAccessService]
    });
  });

  it('should ...', inject([ReportAccessService], (service: ReportAccessService) => {
    expect(service).toBeTruthy();
  }));
});
