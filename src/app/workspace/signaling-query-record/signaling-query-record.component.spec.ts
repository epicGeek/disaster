import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalingQueryRecordComponent } from './signaling-query-record.component';

describe('SignalingQueryRecordComponent', () => {
  let component: SignalingQueryRecordComponent;
  let fixture: ComponentFixture<SignalingQueryRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalingQueryRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalingQueryRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
