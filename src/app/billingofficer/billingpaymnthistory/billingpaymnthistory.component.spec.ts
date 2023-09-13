import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingpaymnthistoryComponent } from './billingpaymnthistory.component';

describe('BillingpaymnthistoryComponent', () => {
  let component: BillingpaymnthistoryComponent;
  let fixture: ComponentFixture<BillingpaymnthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingpaymnthistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingpaymnthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
