import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccessComponent } from './create-access.component';

describe('CreateAccessComponent', () => {
  let component: CreateAccessComponent;
  let fixture: ComponentFixture<CreateAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
