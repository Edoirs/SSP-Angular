import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfloginComponent } from './selflogin.component';

describe('SelfloginComponent', () => {
  let component: SelfloginComponent;
  let fixture: ComponentFixture<SelfloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfloginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
