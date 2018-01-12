import { TestBed, inject } from '@angular/core/testing';

import { SubscriberCommandManageService } from './subscriber-command-manage.service';

describe('SubscriberCommandManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriberCommandManageService]
    });
  });

  it('should be created', inject([SubscriberCommandManageService], (service: SubscriberCommandManageService) => {
    expect(service).toBeTruthy();
  }));
});
