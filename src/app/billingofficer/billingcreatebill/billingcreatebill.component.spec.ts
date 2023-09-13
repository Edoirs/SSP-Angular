import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingcreatebillComponent } from './billingcreatebill.component';

describe('BillingcreatebillComponent', () => {
  let component: BillingcreatebillComponent;
  let fixture: ComponentFixture<BillingcreatebillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingcreatebillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingcreatebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
