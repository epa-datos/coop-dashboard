import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignTowardsRetailWrapperComponent } from './campaign-towards-retail-wrapper.component';

describe('CampaignTowardsRetailWrapperComponent', () => {
  let component: CampaignTowardsRetailWrapperComponent;
  let fixture: ComponentFixture<CampaignTowardsRetailWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignTowardsRetailWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignTowardsRetailWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
