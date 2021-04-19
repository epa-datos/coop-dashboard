import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLollipopComponent } from './chart-lollipop.component';

describe('ChartLollipopComponent', () => {
  let component: ChartLollipopComponent;
  let fixture: ComponentFixture<ChartLollipopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartLollipopComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLollipopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
