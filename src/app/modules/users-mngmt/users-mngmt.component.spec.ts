import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMngmtComponent } from './users-mngmt.component';

describe('UsersMngmtComponent', () => {
  let component: UsersMngmtComponent;
  let fixture: ComponentFixture<UsersMngmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersMngmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersMngmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
