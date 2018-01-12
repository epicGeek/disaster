import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BossStatisticComponent } from './boss-statistic.component';

describe('BossStatisticComponent', () => {
  let component: BossStatisticComponent;
  let fixture: ComponentFixture<BossStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BossStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
