import { TestBed, inject } from '@angular/core/testing';

import { VolteMessageService } from './volte-message.service';

describe('VolteMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolteMessageService]
    });
  });

  it('should be created', inject([VolteMessageService], (service: VolteMessageService) => {
    expect(service).toBeTruthy();
  }));
});
