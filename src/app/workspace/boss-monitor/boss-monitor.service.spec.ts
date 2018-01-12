import { TestBed, inject } from '@angular/core/testing';

import { BossMonitorService } from './boss-monitor.service';

describe('BossMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BossMonitorService]
    });
  });

  it('should be created', inject([BossMonitorService], (service: BossMonitorService) => {
    expect(service).toBeTruthy();
  }));
});
