import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolteMessageComponent } from './volte-message.component';

describe('VolteMessageComponent', () => {
  let component: VolteMessageComponent;
  let fixture: ComponentFixture<VolteMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolteMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolteMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
