import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingprojectionComponent } from './pendingprojection.component';

describe('PendingprojectionComponent', () => {
  let component: PendingprojectionComponent;
  let fixture: ComponentFixture<PendingprojectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingprojectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingprojectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
