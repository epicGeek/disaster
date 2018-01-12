/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainKpiService } from './main-kpi.service';

describe('MainKpiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainKpiService]
    });
  });

  it('should ...', inject([MainKpiService], (service: MainKpiService) => {
    expect(service).toBeTruthy();
  }));
});
