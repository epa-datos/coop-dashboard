import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTabsSelectorComponent } from './multiple-tabs-selector.component';

describe('MultipleTabsSelectorComponent', () => {
  let component: MultipleTabsSelectorComponent;
  let fixture: ComponentFixture<MultipleTabsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleTabsSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTabsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
