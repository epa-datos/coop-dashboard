import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnLineMixComponent } from './chart-column-line-mix.component';

describe('ChartColumnLineMixComponent', () => {
  let component: ChartColumnLineMixComponent;
  let fixture: ComponentFixture<ChartColumnLineMixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartColumnLineMixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartColumnLineMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
