import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualreturnassessmentsComponent } from './annualreturnassessments.component';

describe('AnnualreturnassessmentsComponent', () => {
  let component: AnnualreturnassessmentsComponent;
  let fixture: ComponentFixture<AnnualreturnassessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualreturnassessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualreturnassessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
