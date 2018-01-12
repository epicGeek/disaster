import { TestBed, inject } from '@angular/core/testing';

import { BossStatisticService } from './boss-statistic.service';

describe('BossStatisticService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BossStatisticService]
    });
  });

  it('should be created', inject([BossStatisticService], (service: BossStatisticService) => {
    expect(service).toBeTruthy();
  }));
});
