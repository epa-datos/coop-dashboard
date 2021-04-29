import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMultipleAxesComponent } from './chart-multiple-axes.component';

describe('ChartMultipleAxesComponent', () => {
  let component: ChartMultipleAxesComponent;
  let fixture: ComponentFixture<ChartMultipleAxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartMultipleAxesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartMultipleAxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
