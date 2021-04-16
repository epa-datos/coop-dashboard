import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisitionWrapperComponent } from './acquisition-wrapper.component';

describe('AcquisitionWrapperComponent', () => {
  let component: AcquisitionWrapperComponent;
  let fixture: ComponentFixture<AcquisitionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcquisitionWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquisitionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
