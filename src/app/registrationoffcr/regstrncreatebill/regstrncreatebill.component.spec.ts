import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegstrncreatebillComponent } from './regstrncreatebill.component';

describe('RegstrncreatebillComponent', () => {
  let component: RegstrncreatebillComponent;
  let fixture: ComponentFixture<RegstrncreatebillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegstrncreatebillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegstrncreatebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
