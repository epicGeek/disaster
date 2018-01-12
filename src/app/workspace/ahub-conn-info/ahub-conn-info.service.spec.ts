import { TestBed, inject } from '@angular/core/testing';

import { AhubConnInfoService } from './ahub-conn-info.service';

describe('AhubConnInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AhubConnInfoService]
    });
  });

  it('should be created', inject([AhubConnInfoService], (service: AhubConnInfoService) => {
    expect(service).toBeTruthy();
  }));
});
