import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfpaymenthistoryComponent } from './selfpaymenthistory.component';

describe('SelfpaymenthistoryComponent', () => {
  let component: SelfpaymenthistoryComponent;
  let fixture: ComponentFixture<SelfpaymenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfpaymenthistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfpaymenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
