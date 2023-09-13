import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingprofileComponent } from './billingprofile.component';

describe('BillingprofileComponent', () => {
  let component: BillingprofileComponent;
  let fixture: ComponentFixture<BillingprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
