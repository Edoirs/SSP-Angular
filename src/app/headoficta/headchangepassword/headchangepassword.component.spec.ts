import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadchangepasswordComponent } from './headchangepassword.component';

describe('HeadchangepasswordComponent', () => {
  let component: HeadchangepasswordComponent;
  let fixture: ComponentFixture<HeadchangepasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadchangepasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadchangepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
