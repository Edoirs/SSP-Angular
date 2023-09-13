import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingofficerComponent } from './billingofficer.component';

describe('BillingofficerComponent', () => {
  let component: BillingofficerComponent;
  let fixture: ComponentFixture<BillingofficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingofficerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingofficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
