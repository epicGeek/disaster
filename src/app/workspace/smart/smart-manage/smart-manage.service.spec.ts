/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmartManageService } from './smart-manage.service';

describe('SmartManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartManageService]
    });
  });

  it('should ...', inject([SmartManageService], (service: SmartManageService) => {
    expect(service).toBeTruthy();
  }));
});
