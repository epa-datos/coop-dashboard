import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleBusinessWrapperComponent } from './google-business-wrapper.component';

describe('GoogleBusinessWrapperComponent', () => {
  let component: GoogleBusinessWrapperComponent;
  let fixture: ComponentFixture<GoogleBusinessWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleBusinessWrapperComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleBusinessWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
