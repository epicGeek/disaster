/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KpiMonitorService } from './kpi-monitor.service';

describe('KpiMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KpiMonitorService]
    });
  });

  it('should ...', inject([KpiMonitorService], (service: KpiMonitorService) => {
    expect(service).toBeTruthy();
  }));
});
