import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLineComparisonComponent } from './graph-line-comparison.component';

describe('GraphLineComparisonComponent', () => {
  let component: GraphLineComparisonComponent;
  let fixture: ComponentFixture<GraphLineComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphLineComparisonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLineComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
