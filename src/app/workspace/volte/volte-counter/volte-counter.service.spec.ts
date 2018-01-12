import { TestBed, inject } from '@angular/core/testing';

import { VolteCounterService } from './volte-counter.service';

describe('VolteCounterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolteCounterService]
    });
  });

  it('should be created', inject([VolteCounterService], (service: VolteCounterService) => {
    expect(service).toBeTruthy();
  }));
});
