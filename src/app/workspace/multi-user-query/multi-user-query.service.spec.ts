import { TestBed, inject } from '@angular/core/testing';

import { MultiUserQueryService } from './multi-user-query.service';

describe('MultiUserQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiUserQueryService]
    });
  });

  it('should ...', inject([MultiUserQueryService], (service: MultiUserQueryService) => {
    expect(service).toBeTruthy();
  }));
});
