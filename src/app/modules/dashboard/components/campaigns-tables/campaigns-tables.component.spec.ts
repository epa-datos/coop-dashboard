import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsTablesComponent } from './campaigns-tables.component';

describe('CampaignsTablesComponent', () => {
  let component: CampaignsTablesComponent;
  let fixture: ComponentFixture<CampaignsTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
