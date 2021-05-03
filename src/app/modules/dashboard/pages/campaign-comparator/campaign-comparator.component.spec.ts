import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignComparatorComponent } from './campaign-comparator.component';

describe('CampaignComparatorComponent', () => {
  let component: CampaignComparatorComponent;
  let fixture: ComponentFixture<CampaignComparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignComparatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
