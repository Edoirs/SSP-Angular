import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadbillinggeneratedbillsComponent } from './headbillinggeneratedbills.component';

describe('HeadbillinggeneratedbillsComponent', () => {
  let component: HeadbillinggeneratedbillsComponent;
  let fixture: ComponentFixture<HeadbillinggeneratedbillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadbillinggeneratedbillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadbillinggeneratedbillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
