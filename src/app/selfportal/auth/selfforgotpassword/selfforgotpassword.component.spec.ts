import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfforgotpasswordComponent } from './selfforgotpassword.component';

describe('SelfforgotpasswordComponent', () => {
  let component: SelfforgotpasswordComponent;
  let fixture: ComponentFixture<SelfforgotpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfforgotpasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfforgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
