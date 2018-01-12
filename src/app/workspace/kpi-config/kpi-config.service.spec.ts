/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KpiConfigService } from './kpi-config.service';

describe('KpiConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KpiConfigService]
    });
  });

  it('should ...', inject([KpiConfigService], (service: KpiConfigService) => {
    expect(service).toBeTruthy();
  }));
});
