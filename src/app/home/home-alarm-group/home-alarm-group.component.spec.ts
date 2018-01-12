import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAlarmGroupComponent } from './home-alarm-group.component';

describe('HomeAlarmGroupComponent', () => {
  let component: HomeAlarmGroupComponent;
  let fixture: ComponentFixture<HomeAlarmGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAlarmGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAlarmGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
