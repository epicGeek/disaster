import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImsUnitLogComponent } from './ims-unit-log.component';

describe('ImsUnitLogComponent', () => {
  let component: ImsUnitLogComponent;
  let fixture: ComponentFixture<ImsUnitLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImsUnitLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImsUnitLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
