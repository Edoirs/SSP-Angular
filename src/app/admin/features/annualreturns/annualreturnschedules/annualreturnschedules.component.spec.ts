import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualreturnschedulesComponent } from './annualreturnschedules.component';

describe('AnnualreturnschedulesComponent', () => {
  let component: AnnualreturnschedulesComponent;
  let fixture: ComponentFixture<AnnualreturnschedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualreturnschedulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualreturnschedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
