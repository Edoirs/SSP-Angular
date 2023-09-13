import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsupchatComponent } from './whatsupchat.component';

describe('WhatsupchatComponent', () => {
  let component: WhatsupchatComponent;
  let fixture: ComponentFixture<WhatsupchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsupchatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsupchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
