import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadmanageadminComponent } from './headmanageadmin.component';

describe('HeadmanageadminComponent', () => {
  let component: HeadmanageadminComponent;
  let fixture: ComponentFixture<HeadmanageadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadmanageadminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadmanageadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
