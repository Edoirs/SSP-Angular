import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadofbillingComponent } from './headofbilling.component';

describe('HeadofbillingComponent', () => {
  let component: HeadofbillingComponent;
  let fixture: ComponentFixture<HeadofbillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadofbillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadofbillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
