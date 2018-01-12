import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberCommandManageComponent } from './subscriber-command-manage.component';

describe('SubscriberCommandManageComponent', () => {
  let component: SubscriberCommandManageComponent;
  let fixture: ComponentFixture<SubscriberCommandManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberCommandManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberCommandManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
