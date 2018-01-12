import { TestBed, inject } from '@angular/core/testing';

import { SignalingQueryRecordService } from './signaling-query-record.service';

describe('SignalingQueryRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalingQueryRecordService]
    });
  });

  it('should be created', inject([SignalingQueryRecordService], (service: SignalingQueryRecordService) => {
    expect(service).toBeTruthy();
  }));
});
