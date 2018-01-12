import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolteAlarmComponent } from './volte-alarm.component';

describe('VolteAlarmComponent', () => {
  let component: VolteAlarmComponent;
  let fixture: ComponentFixture<VolteAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolteAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolteAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
