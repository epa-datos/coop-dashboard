import { TestBed } from '@angular/core/testing';

import { IndexedService } from './indexed.service';

describe('IndexedService', () => {
  let service: IndexedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
