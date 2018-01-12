import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmMonitorHistoryComponent } from './alarm-monitor-history.component';

describe('AlarmMonitorHistoryComponent', () => {
  let component: AlarmMonitorHistoryComponent;
  let fixture: ComponentFixture<AlarmMonitorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmMonitorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmMonitorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
