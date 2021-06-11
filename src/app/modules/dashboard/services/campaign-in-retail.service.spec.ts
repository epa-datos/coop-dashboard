import { TestBed } from '@angular/core/testing';

import { CampaignInRetailService } from './campaign-in-retail.service';

describe('CampaignInRetailService', () => {
  let service: CampaignInRetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampaignInRetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
