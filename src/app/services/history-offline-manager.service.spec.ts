import { TestBed } from '@angular/core/testing';

import { HistoryOfflineManagerService } from './history-offline-manager.service';

describe('HistoryOfflineManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryOfflineManagerService = TestBed.get(HistoryOfflineManagerService);
    expect(service).toBeTruthy();
  });
});
