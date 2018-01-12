import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNavGroupComponent } from './home-nav-group.component';

describe('HomeNavGroupComponent', () => {
  let component: HomeNavGroupComponent;
  let fixture: ComponentFixture<HomeNavGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeNavGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeNavGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
