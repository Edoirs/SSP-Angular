import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbillstructureComponent } from './headbillstructure.component';

describe('HeadbillstructureComponent', () => {
  let component: HeadbillstructureComponent;
  let fixture: ComponentFixture<HeadbillstructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbillstructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbillstructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
