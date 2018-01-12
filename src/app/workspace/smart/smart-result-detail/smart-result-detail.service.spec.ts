/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmartResultDetailService } from './smart-result-detail.service';

describe('SmartResultDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartResultDetailService]
    });
  });

  it('should ...', inject([SmartResultDetailService], (service: SmartResultDetailService) => {
    expect(service).toBeTruthy();
  }));
});
