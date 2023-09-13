import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationoffcrComponent } from './registrationoffcr.component';

describe('RegistrationoffcrComponent', () => {
  let component: RegistrationoffcrComponent;
  let fixture: ComponentFixture<RegistrationoffcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationoffcrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationoffcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
