/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SingleUserQueryService } from './single-user-query.service';

describe('SingleUserQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SingleUserQueryService]
    });
  });

  it('should ...', inject([SingleUserQueryService], (service: SingleUserQueryService) => {
    expect(service).toBeTruthy();
  }));
});
