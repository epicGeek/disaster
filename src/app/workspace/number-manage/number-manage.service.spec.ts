import { TestBed, inject } from '@angular/core/testing';

import { NumberManageService } from './number-manage.service';

describe('NumberManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumberManageService]
    });
  });

  it('should ...', inject([NumberManageService], (service: NumberManageService) => {
    expect(service).toBeTruthy();
  }));
});
