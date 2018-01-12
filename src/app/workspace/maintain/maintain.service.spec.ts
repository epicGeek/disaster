/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MaintainService } from './maintain.service';

describe('MaintainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaintainService]
    });
  });

  it('should ...', inject([MaintainService], (service: MaintainService) => {
    expect(service).toBeTruthy();
  }));
});
