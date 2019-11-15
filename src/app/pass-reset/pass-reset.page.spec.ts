import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassResetPage } from './pass-reset.page';

describe('PassResetPage', () => {
  let component: PassResetPage;
  let fixture: ComponentFixture<PassResetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassResetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
