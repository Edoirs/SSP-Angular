import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfconsumerlistingComponent } from './selfconsumerlisting.component';

describe('SelfconsumerlistingComponent', () => {
  let component: SelfconsumerlistingComponent;
  let fixture: ComponentFixture<SelfconsumerlistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfconsumerlistingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfconsumerlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
