import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingbillstructureComponent } from './billingbillstructure.component';

describe('BillingbillstructureComponent', () => {
  let component: BillingbillstructureComponent;
  let fixture: ComponentFixture<BillingbillstructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingbillstructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingbillstructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
