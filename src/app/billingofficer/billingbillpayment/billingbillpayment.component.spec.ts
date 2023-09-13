import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingbillpaymentComponent } from './billingbillpayment.component';

describe('BillingbillpaymentComponent', () => {
  let component: BillingbillpaymentComponent;
  let fixture: ComponentFixture<BillingbillpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingbillpaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingbillpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
