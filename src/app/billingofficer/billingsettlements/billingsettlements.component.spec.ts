import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingsettlementsComponent } from './billingsettlements.component';

describe('BillingsettlementsComponent', () => {
  let component: BillingsettlementsComponent;
  let fixture: ComponentFixture<BillingsettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingsettlementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingsettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
