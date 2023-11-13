import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedprojectionComponent } from './approvedprojection.component';

describe('ApprovedprojectionComponent', () => {
  let component: ApprovedprojectionComponent;
  let fixture: ComponentFixture<ApprovedprojectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedprojectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedprojectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
