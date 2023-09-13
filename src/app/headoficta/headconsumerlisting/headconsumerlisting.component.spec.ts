import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadconsumerlistingComponent } from './headconsumerlisting.component';

describe('HeadconsumerlistingComponent', () => {
  let component: HeadconsumerlistingComponent;
  let fixture: ComponentFixture<HeadconsumerlistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadconsumerlistingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadconsumerlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
