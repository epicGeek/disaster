import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolteReportComponent } from './volte-report.component';

describe('VolteReportComponent', () => {
  let component: VolteReportComponent;
  let fixture: ComponentFixture<VolteReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolteReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
