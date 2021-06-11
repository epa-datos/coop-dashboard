import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignInRetailWrapperComponent } from './campaign-in-retail-wrapper.component';

describe('CampaignInRetailWrapperComponent', () => {
  let component: CampaignInRetailWrapperComponent;
  let fixture: ComponentFixture<CampaignInRetailWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignInRetailWrapperComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignInRetailWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
