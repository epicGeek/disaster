/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckItemService } from './check-item.service';

describe('CheckItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckItemService]
    });
  });

  it('should ...', inject([CheckItemService], (service: CheckItemService) => {
    expect(service).toBeTruthy();
  }));
});
