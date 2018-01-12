/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmartResultFilterService } from './smart-result-filter.service';

describe('SmartResultFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartResultFilterService]
    });
  });

  it('should ...', inject([SmartResultFilterService], (service: SmartResultFilterService) => {
    expect(service).toBeTruthy();
  }));
});
