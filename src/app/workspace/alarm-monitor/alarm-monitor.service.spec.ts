/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AlarmMonitorService } from './alarm-monitor.service';

describe('AlarmMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlarmMonitorService]
    });
  });

  it('should ...', inject([AlarmMonitorService], (service: AlarmMonitorService) => {
    expect(service).toBeTruthy();
  }));
});
