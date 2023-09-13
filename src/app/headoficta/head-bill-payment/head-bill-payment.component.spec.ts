import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadBillPaymentComponent } from './head-bill-payment.component';

describe('HeadBillPaymentComponent', () => {
  let component: HeadBillPaymentComponent;
  let fixture: ComponentFixture<HeadBillPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadBillPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadBillPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
