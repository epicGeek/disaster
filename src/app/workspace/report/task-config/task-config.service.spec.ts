/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TaskConfigService } from './task-config.service';

describe('TaskConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskConfigService]
    });
  });

  it('should ...', inject([TaskConfigService], (service: TaskConfigService) => {
    expect(service).toBeTruthy();
  }));
});
