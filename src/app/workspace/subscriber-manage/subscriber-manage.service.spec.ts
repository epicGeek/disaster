import { TestBed, inject } from '@angular/core/testing';

import { SubscriberManageService } from './subscriber-manage.service';

describe('SubscriberManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriberManageService]
    });
  });

  it('should be created', inject([SubscriberManageService], (service: SubscriberManageService) => {
    expect(service).toBeTruthy();
  }));
});
