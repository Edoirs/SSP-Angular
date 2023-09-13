import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbliingconsumerlistComponent } from './headbliingconsumerlist.component';

describe('HeadbliingconsumerlistComponent', () => {
  let component: HeadbliingconsumerlistComponent;
  let fixture: ComponentFixture<HeadbliingconsumerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbliingconsumerlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbliingconsumerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
