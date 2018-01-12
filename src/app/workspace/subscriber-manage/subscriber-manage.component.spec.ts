import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberManageComponent } from './subscriber-manage.component';

describe('SubscriberManageComponent', () => {
  let component: SubscriberManageComponent;
  let fixture: ComponentFixture<SubscriberManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
