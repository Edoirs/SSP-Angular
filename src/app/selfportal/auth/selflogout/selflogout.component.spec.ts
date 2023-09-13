import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelflogoutComponent } from './selflogout.component';

describe('SelflogoutComponent', () => {
  let component: SelflogoutComponent;
  let fixture: ComponentFixture<SelflogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelflogoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelflogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
