import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfbillpaymnetComponent } from './selfbillpaymnet.component';

describe('SelfbillpaymnetComponent', () => {
  let component: SelfbillpaymnetComponent;
  let fixture: ComponentFixture<SelfbillpaymnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfbillpaymnetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfbillpaymnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
