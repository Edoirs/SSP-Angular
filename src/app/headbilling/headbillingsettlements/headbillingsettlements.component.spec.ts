import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbillingsettlementsComponent } from './headbillingsettlements.component';

describe('HeadbillingsettlementsComponent', () => {
  let component: HeadbillingsettlementsComponent;
  let fixture: ComponentFixture<HeadbillingsettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbillingsettlementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbillingsettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
