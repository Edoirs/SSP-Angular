import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfresetpasswordComponent } from './selfresetpassword.component';

describe('SelfresetpasswordComponent', () => {
  let component: SelfresetpasswordComponent;
  let fixture: ComponentFixture<SelfresetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfresetpasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfresetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
