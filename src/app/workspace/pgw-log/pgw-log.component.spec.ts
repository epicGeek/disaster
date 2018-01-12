/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PgwLogComponent } from './pgw-log.component';

describe('PgwLogComponent', () => {
  let component: PgwLogComponent;
  let fixture: ComponentFixture<PgwLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgwLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgwLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
