/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmartResultService } from './smart-result.service';

describe('SmartResultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartResultService]
    });
  });

  it('should ...', inject([SmartResultService], (service: SmartResultService) => {
    expect(service).toBeTruthy();
  }));
});
