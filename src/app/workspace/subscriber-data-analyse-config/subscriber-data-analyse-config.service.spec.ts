import { TestBed, inject } from '@angular/core/testing';

import { SubscriberDataAnalyseConfigService } from './subscriber-data-analyse-config.service';

describe('SubscriberDataAnalyseConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriberDataAnalyseConfigService]
    });
  });

  it('should ...', inject([SubscriberDataAnalyseConfigService], (service: SubscriberDataAnalyseConfigService) => {
    expect(service).toBeTruthy();
  }));
});
