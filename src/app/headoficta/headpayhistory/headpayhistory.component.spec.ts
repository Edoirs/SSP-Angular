import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadpayhistoryComponent } from './headpayhistory.component';

describe('HeadpayhistoryComponent', () => {
  let component: HeadpayhistoryComponent;
  let fixture: ComponentFixture<HeadpayhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadpayhistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadpayhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
