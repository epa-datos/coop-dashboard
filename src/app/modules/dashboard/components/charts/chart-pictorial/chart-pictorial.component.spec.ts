import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPictorialComponent } from './chart-pictorial.component';

describe('ChartPictorialComponent', () => {
  let component: ChartPictorialComponent;
  let fixture: ComponentFixture<ChartPictorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartPictorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPictorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
