import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationbillpaymntComponent } from './registrationbillpaymnt.component';

describe('RegistrationbillpaymntComponent', () => {
  let component: RegistrationbillpaymntComponent;
  let fixture: ComponentFixture<RegistrationbillpaymntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationbillpaymntComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationbillpaymntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
