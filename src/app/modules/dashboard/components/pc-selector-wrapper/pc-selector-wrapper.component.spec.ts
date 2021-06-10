import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcSelectorWrapperComponent } from './pc-selector-wrapper.component';

describe('PcSelectorWrapperComponent', () => {
  let component: PcSelectorWrapperComponent;
  let fixture: ComponentFixture<PcSelectorWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcSelectorWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcSelectorWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
