import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLineSeriesComponent } from './graph-line-series.component';

describe('GraphLineSeriesComponent', () => {
  let component: GraphLineSeriesComponent;
  let fixture: ComponentFixture<GraphLineSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphLineSeriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLineSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
