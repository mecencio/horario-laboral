import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTrackerComponent } from './day-tracker.component';

describe('DayTrackerComponent', () => {
  let component: DayTrackerComponent;
  let fixture: ComponentFixture<DayTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
