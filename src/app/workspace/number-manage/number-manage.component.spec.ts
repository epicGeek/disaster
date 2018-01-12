import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberManageComponent } from './number-manage.component';

describe('NumberManageComponent', () => {
  let component: NumberManageComponent;
  let fixture: ComponentFixture<NumberManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
