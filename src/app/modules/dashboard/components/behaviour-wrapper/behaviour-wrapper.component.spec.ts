import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviourWrapperComponent } from './behaviour-wrapper.component';

describe('BehaviourWrapperComponent', () => {
  let component: BehaviourWrapperComponent;
  let fixture: ComponentFixture<BehaviourWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviourWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviourWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
