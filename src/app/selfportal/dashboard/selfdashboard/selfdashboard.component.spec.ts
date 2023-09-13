import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfdashboardComponent } from './selfdashboard.component';

describe('SelfdashboardComponent', () => {
  let component: SelfdashboardComponent;
  let fixture: ComponentFixture<SelfdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
