import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingreportsbillsComponent } from './billingreportsbills.component';

describe('BillingreportsbillsComponent', () => {
  let component: BillingreportsbillsComponent;
  let fixture: ComponentFixture<BillingreportsbillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingreportsbillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingreportsbillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
