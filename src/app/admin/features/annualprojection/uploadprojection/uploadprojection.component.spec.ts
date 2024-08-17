import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadprojectionComponent } from './uploadprojection.component';

describe('UploadprojectionComponent', () => {
  let component: UploadprojectionComponent;
  let fixture: ComponentFixture<UploadprojectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadprojectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadprojectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
