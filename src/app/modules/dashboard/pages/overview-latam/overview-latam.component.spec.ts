import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewLatamComponent } from './overview-latam.component';

describe('OverviewLatamComponent', () => {
  let component: OverviewLatamComponent;
  let fixture: ComponentFixture<OverviewLatamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewLatamComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewLatamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
