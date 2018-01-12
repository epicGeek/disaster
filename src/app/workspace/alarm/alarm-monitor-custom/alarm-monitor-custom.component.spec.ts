import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmMonitorCustomComponent } from './alarm-monitor-custom.component';

describe('AlarmMonitorCustomComponent', () => {
  let component: AlarmMonitorCustomComponent;
  let fixture: ComponentFixture<AlarmMonitorCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmMonitorCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmMonitorCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
