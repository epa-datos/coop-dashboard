import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleBusinessFiltersComponent } from './google-business-filters.component';

describe('GoogleBusinessFiltersComponent', () => {
  let component: GoogleBusinessFiltersComponent;
  let fixture: ComponentFixture<GoogleBusinessFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleBusinessFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleBusinessFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
