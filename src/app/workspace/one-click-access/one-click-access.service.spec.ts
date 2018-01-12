import { TestBed, inject } from '@angular/core/testing';

import { OneClickAccessService } from './one-click-access.service';

describe('OneClickAccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OneClickAccessService]
    });
  });

  it('should ...', inject([OneClickAccessService], (service: OneClickAccessService) => {
    expect(service).toBeTruthy();
  }));
});
