import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteroffcrprofileComponent } from './registeroffcrprofile.component';

describe('RegisteroffcrprofileComponent', () => {
  let component: RegisteroffcrprofileComponent;
  let fixture: ComponentFixture<RegisteroffcrprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteroffcrprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteroffcrprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
