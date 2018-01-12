/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReportCreateService } from './report-create.service';

describe('ReportCreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportCreateService]
    });
  });

  it('should ...', inject([ReportCreateService], (service: ReportCreateService) => {
    expect(service).toBeTruthy();
  }));
});
