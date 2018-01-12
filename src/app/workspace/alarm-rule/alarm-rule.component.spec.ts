import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmRuleComponent } from './alarm-rule.component';

describe('AlarmRuleComponent', () => {
  let component: AlarmRuleComponent;
  let fixture: ComponentFixture<AlarmRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
