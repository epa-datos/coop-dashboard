import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineComparisonComponent } from './chart-line-comparison.component';

describe('ChartLineComparisonComponent', () => {
  let component: ChartLineComparisonComponent;
  let fixture: ComponentFixture<ChartLineComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartLineComparisonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
