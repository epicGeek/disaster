import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolteCounterComponent } from './volte-counter.component';

describe('VolteCounterComponent', () => {
  let component: VolteCounterComponent;
  let fixture: ComponentFixture<VolteCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolteCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolteCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
