import { TestBed, inject } from '@angular/core/testing';

import { AlarmMonitorHistoryService } from './alarm-monitor-history.service';

describe('AlarmMonitorHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlarmMonitorHistoryService]
    });
  });

  it('should ...', inject([AlarmMonitorHistoryService], (service: AlarmMonitorHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
