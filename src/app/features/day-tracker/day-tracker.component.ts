import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { WeekService } from '../../core/services/week.service';
import { IDay } from '../../core/interfaces/i-day';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { WorkdayService } from '../../core/services/workday.service';

@Component({
  selector: 'app-day-tracker',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DatePickerModule,
    FloatLabel,
    FormsModule,
    ToggleSwitch,
    Tooltip,
  ],
  templateUrl: './day-tracker.component.html',
  styleUrl: './day-tracker.component.scss',
})
export class DayTrackerComponent implements OnInit {
  today!: IDay;
  clockInTime: Date | undefined;
  clockOutTime: Date | undefined;
  toggled = false;
  estimatedExit: Date | undefined;

  constructor(
    private weekService: WeekService,
    private workdayService: WorkdayService,
  ) {}

  ngOnInit() {
    const today = new Date('2025-06-23').toLocaleDateString('es-AR', {
      //const today = new Date("2025-06-23").toLocaleDateString('en-US', {
      weekday: 'long',
    });

    this.weekService.getDayById(today).subscribe({
      next: (day) => {
        this.today = day;
        this.clockInTime = day.schedule.clockInTime
          ? new Date(day.schedule.clockInTime)
          : undefined;
        this.clockOutTime = day.schedule.clockOutTime
          ? new Date(day.schedule.clockOutTime)
          : undefined;

        if (this.clockInTime) this.calculateEstimatedExit();
      },
      error: (err) => {
        console.error('Error fetching day:', err);
      },
    });
  }

  clockIn() {
    this.clockInTime = new Date();
    this.calculateEstimatedExit();
    this.save();
  }

  clockOut() {
    this.clockOutTime = new Date();
    this.save();
  }

  clear() {
    this.clockInTime = undefined;
    this.clockOutTime = undefined;
    this.estimatedExit = undefined;

    this.save();
  }

  calculateEstimatedExit() {
    if (!this.clockInTime) return;

    const workdayHours = this.workdayService.getWorkdayHours();


    if (this.toggled) {
      // If toggled, consider accumulated time
      this.weekService.getAccumulatedTime(this.today.name).subscribe({
        next: (accumulatedTime) => {
          const estimatedExitTime = new Date(
            (this.clockInTime?.getTime() || 0) + (workdayHours + accumulatedTime) * 3600000
          );
          this.estimatedExit = estimatedExitTime;
        },
        error: (err) => {
          // Fallback to just workday hours if there's an error
          const estimatedExitTime = new Date(
            (this.clockInTime?.getTime() || 0) + workdayHours * 3600000
          );
          this.estimatedExit = estimatedExitTime;
        }
      });
    } else {
      // If not toggled, do not consider accumulated time
      const estimatedExitTime = new Date(
        this.clockInTime.getTime() + workdayHours * 3600000
      );
      this.estimatedExit = estimatedExitTime;
    }
  }

  save() {
    console.log('Saving clock-in and clock-out times...');
    this.today.schedule.clockInTime = this.clockInTime;
    this.today.schedule.clockOutTime = this.clockOutTime;

    this.weekService.updateDay(this.today).subscribe({
      next: (response) => {
        console.log('Day updated successfully:', response);
      },
      error: (err) => {
        console.error('Error updating day:', err);
      },
    });
  }
}
