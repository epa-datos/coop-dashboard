import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFunnelComponent } from './chart-funnel.component';

describe('ChartFunnelComponent', () => {
  let component: ChartFunnelComponent;
  let fixture: ComponentFixture<ChartFunnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartFunnelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
