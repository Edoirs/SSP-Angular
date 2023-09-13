import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadgeneratedbillsComponent } from './headgeneratedbills.component';

describe('HeadgeneratedbillsComponent', () => {
  let component: HeadgeneratedbillsComponent;
  let fixture: ComponentFixture<HeadgeneratedbillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadgeneratedbillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadgeneratedbillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
