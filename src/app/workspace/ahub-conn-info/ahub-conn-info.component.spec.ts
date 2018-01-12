import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhubConnInfoComponent } from './ahub-conn-info.component';

describe('AhubConnInfoComponent', () => {
  let component: AhubConnInfoComponent;
  let fixture: ComponentFixture<AhubConnInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AhubConnInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhubConnInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
