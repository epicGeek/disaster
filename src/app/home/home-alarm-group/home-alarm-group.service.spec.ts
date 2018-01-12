/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HomeAlarmGroupService } from './home-alarm-group.service';

describe('HomeAlarmGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeAlarmGroupService]
    });
  });

  it('should ...', inject([HomeAlarmGroupService], (service: HomeAlarmGroupService) => {
    expect(service).toBeTruthy();
  }));
});
