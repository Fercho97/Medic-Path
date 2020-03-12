import { TestBed } from '@angular/core/testing';

import { AlertsManagerService } from './alerts-manager.service';

describe('AlertsManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertsManagerService = TestBed.get(AlertsManagerService);
    expect(service).toBeTruthy();
  });
});
