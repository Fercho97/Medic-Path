import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassChangePage } from './pass-change.page';

describe('PassChangePage', () => {
  let component: PassChangePage;
  let fixture: ComponentFixture<PassChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassChangePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
