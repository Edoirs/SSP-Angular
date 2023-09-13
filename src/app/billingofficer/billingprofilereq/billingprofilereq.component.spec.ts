import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingprofilereqComponent } from './billingprofilereq.component';

describe('BillingprofilereqComponent', () => {
  let component: BillingprofilereqComponent;
  let fixture: ComponentFixture<BillingprofilereqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingprofilereqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingprofilereqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
