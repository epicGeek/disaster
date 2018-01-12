import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneClickAccessComponent } from './one-click-access.component';

describe('OneClickAccessComponent', () => {
  let component: OneClickAccessComponent;
  let fixture: ComponentFixture<OneClickAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneClickAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneClickAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
