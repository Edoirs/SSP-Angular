import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadprofilerequestsComponent } from './headprofilerequests.component';

describe('HeadprofilerequestsComponent', () => {
  let component: HeadprofilerequestsComponent;
  let fixture: ComponentFixture<HeadprofilerequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadprofilerequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadprofilerequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
