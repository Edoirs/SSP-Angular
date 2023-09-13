import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadictsettlementsComponent } from './headictsettlements.component';

describe('HeadictsettlementsComponent', () => {
  let component: HeadictsettlementsComponent;
  let fixture: ComponentFixture<HeadictsettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadictsettlementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadictsettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
