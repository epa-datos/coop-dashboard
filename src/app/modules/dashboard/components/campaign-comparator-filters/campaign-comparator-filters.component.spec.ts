import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignComparatorFiltersComponent } from './campaign-comparator-filters.component';

describe('CampaignComparatorFiltersComponent', () => {
  let component: CampaignComparatorFiltersComponent;
  let fixture: ComponentFixture<CampaignComparatorFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignComparatorFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignComparatorFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
