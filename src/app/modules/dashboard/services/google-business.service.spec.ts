import { TestBed } from '@angular/core/testing';

import { GoogleBusinessService } from './google-business.service';

describe('GoogleBusinessService', () => {
  let service: GoogleBusinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleBusinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
