import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiUserQueryComponent } from './multi-user-query.component';

describe('MultiUserQueryComponent', () => {
  let component: MultiUserQueryComponent;
  let fixture: ComponentFixture<MultiUserQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiUserQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiUserQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
