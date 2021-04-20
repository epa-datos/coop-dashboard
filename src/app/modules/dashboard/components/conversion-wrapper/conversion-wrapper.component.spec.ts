import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionWrapperComponent } from './conversion-wrapper.component';

describe('ConversionWrapperComponent', () => {
  let component: ConversionWrapperComponent;
  let fixture: ComponentFixture<ConversionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversionWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
