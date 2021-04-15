import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLineMultipleComponent } from './graph-line-multiple.component';

describe('GraphLineMultipleComponent', () => {
  let component: GraphLineMultipleComponent;
  let fixture: ComponentFixture<GraphLineMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphLineMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLineMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
