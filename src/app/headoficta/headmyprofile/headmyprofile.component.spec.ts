import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadmyprofileComponent } from './headmyprofile.component';

describe('HeadmyprofileComponent', () => {
  let component: HeadmyprofileComponent;
  let fixture: ComponentFixture<HeadmyprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadmyprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadmyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
