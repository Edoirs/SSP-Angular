import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbillingpaymenthistryComponent } from './headbillingpaymenthistry.component';

describe('HeadbillingpaymenthistryComponent', () => {
  let component: HeadbillingpaymenthistryComponent;
  let fixture: ComponentFixture<HeadbillingpaymenthistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbillingpaymenthistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbillingpaymenthistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
