import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BossMonitorComponent } from './boss-monitor.component';

describe('BossMonitorComponent', () => {
  let component: BossMonitorComponent;
  let fixture: ComponentFixture<BossMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BossMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
