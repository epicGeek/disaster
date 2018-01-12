import { TestBed, inject } from '@angular/core/testing';

import { VolteReportService } from './volte-report.service';

describe('VolteReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolteReportService]
    });
  });

  it('should be created', inject([VolteReportService], (service: VolteReportService) => {
    expect(service).toBeTruthy();
  }));
});
