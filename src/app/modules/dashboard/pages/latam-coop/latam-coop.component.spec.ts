import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatamCoopComponent } from './latam-coop.component';

describe('LatamCoopComponent', () => {
  let component: LatamCoopComponent;
  let fixture: ComponentFixture<LatamCoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatamCoopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatamCoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
