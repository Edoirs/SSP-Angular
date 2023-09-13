import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbillingbillstrctureComponent } from './headbillingbillstrcture.component';

describe('HeadbillingbillstrctureComponent', () => {
  let component: HeadbillingbillstrctureComponent;
  let fixture: ComponentFixture<HeadbillingbillstrctureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbillingbillstrctureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbillingbillstrctureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
