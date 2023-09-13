import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadtariffsComponent } from './headtariffs.component';

describe('HeadtariffsComponent', () => {
  let component: HeadtariffsComponent;
  let fixture: ComponentFixture<HeadtariffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadtariffsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadtariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
