import { TestBed } from '@angular/core/testing';

import { CampaignComparatorService } from './campaign-comparator.service';

describe('CampaignComparatorService', () => {
  let service: CampaignComparatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampaignComparatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
