import { TestBed, inject } from '@angular/core/testing';

import { VolteAlarmService } from './volte-alarm.service';

describe('VolteAlarmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolteAlarmService]
    });
  });

  it('should be created', inject([VolteAlarmService], (service: VolteAlarmService) => {
    expect(service).toBeTruthy();
  }));
});
