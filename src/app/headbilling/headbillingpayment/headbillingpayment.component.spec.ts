import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbillingpaymentComponent } from './headbillingpayment.component';

describe('HeadbillingpaymentComponent', () => {
  let component: HeadbillingpaymentComponent;
  let fixture: ComponentFixture<HeadbillingpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbillingpaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbillingpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
