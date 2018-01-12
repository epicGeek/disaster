/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnitManageService } from './unit-manage.service';

describe('UnitManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitManageService]
    });
  });

  it('should ...', inject([UnitManageService], (service: UnitManageService) => {
    expect(service).toBeTruthy();
  }));
});
