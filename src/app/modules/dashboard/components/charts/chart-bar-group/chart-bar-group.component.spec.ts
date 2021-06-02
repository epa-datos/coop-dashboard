import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarGroupComponent } from './chart-bar-group.component';

describe('ChartBarGroupComponent', () => {
  let component: ChartBarGroupComponent;
  let fixture: ComponentFixture<ChartBarGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartBarGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
