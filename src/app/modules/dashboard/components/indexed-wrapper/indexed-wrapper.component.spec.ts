import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexedWrapperComponent } from './indexed-wrapper.component';

describe('IndexedWrapperComponent', () => {
  let component: IndexedWrapperComponent;
  let fixture: ComponentFixture<IndexedWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexedWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexedWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
