import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbillingprofilereqComponent } from './headbillingprofilereq.component';

describe('HeadbillingprofilereqComponent', () => {
  let component: HeadbillingprofilereqComponent;
  let fixture: ComponentFixture<HeadbillingprofilereqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbillingprofilereqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbillingprofilereqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
