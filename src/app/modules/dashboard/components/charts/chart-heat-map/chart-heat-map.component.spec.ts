import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHeatMapComponent } from './chart-heat-map.component';

describe('ChartHeatMapComponent', () => {
  let component: ChartHeatMapComponent;
  let fixture: ComponentFixture<ChartHeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartHeatMapComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
