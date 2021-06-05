import { TestBed } from '@angular/core/testing';

import { CampaignTowardsRetailService } from './campaign-towards-retail.service';

describe('CampaignTowardsRetailService', () => {
  let service: CampaignTowardsRetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampaignTowardsRetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
