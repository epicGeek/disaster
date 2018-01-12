import { TestBed, inject } from '@angular/core/testing';

import { AlarmMonitorCustomService } from './alarm-monitor-custom.service';

describe('AlarmMonitorCustomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlarmMonitorCustomService]
    });
  });

  it('should ...', inject([AlarmMonitorCustomService], (service: AlarmMonitorCustomService) => {
    expect(service).toBeTruthy();
  }));
});
