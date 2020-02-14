import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedDiagnosticPage } from './guided-diagnostic.page';

describe('GuidedDiagnosticPage', () => {
  let component: GuidedDiagnosticPage;
  let fixture: ComponentFixture<GuidedDiagnosticPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidedDiagnosticPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedDiagnosticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
