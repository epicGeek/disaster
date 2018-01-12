import { TestBed, inject } from '@angular/core/testing';

import { AlarmRuleService } from './alarm-rule.service';

describe('AlarmRuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlarmRuleService]
    });
  });

  it('should be created', inject([AlarmRuleService], (service: AlarmRuleService) => {
    expect(service).toBeTruthy();
  }));
});
