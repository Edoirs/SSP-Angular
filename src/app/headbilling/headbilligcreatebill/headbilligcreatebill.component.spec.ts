import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbilligcreatebillComponent } from './headbilligcreatebill.component';

describe('HeadbilligcreatebillComponent', () => {
  let component: HeadbilligcreatebillComponent;
  let fixture: ComponentFixture<HeadbilligcreatebillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbilligcreatebillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbilligcreatebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
