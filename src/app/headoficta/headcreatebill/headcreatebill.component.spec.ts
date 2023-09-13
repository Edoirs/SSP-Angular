import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadcreatebillComponent } from './headcreatebill.component';

describe('HeadcreatebillComponent', () => {
  let component: HeadcreatebillComponent;
  let fixture: ComponentFixture<HeadcreatebillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadcreatebillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadcreatebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
