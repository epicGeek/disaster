import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberDataAnalyseConfigComponent } from './subscriber-data-analyse-config.component';

describe('SubscriberDataAnalyseConfigComponent', () => {
  let component: SubscriberDataAnalyseConfigComponent;
  let fixture: ComponentFixture<SubscriberDataAnalyseConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberDataAnalyseConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberDataAnalyseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
