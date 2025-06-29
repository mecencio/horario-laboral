import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { WeekService } from '../../core/services/week.service';
import { IDay } from '../../core/interfaces/i-day';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-day-tracker',
  imports: [
    CommonModule,
    ButtonModule,
    FloatLabel,
    DatePickerModule,
    CardModule,
    FormsModule,
  ],
  templateUrl: './day-tracker.component.html',
  styleUrl: './day-tracker.component.scss',
})
export class DayTrackerComponent implements OnInit {
  today!: IDay;
  clockInTime: Date | undefined;
  clockOutTime: Date | undefined;

  constructor(private weekService: WeekService) {}

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

        console.log('Today is ' + this.today.name);
        console.log(
          'Clock-in time is ' + this.clockInTime?.toLocaleTimeString()
        );
        console.log(
          'Clock-out time is ' + this.clockOutTime?.toLocaleTimeString()
        );
      },
      error: (err) => {
        console.error('Error fetching day:', err);
      },
    });
  }

  clockIn() {
    this.clockInTime = new Date();
    console.log('Clock-in registered ' + this.clockInTime.toLocaleTimeString());
  }

  clockOut() {
    this.clockOutTime = new Date();
    console.log(
      'Clock-out registered ' + this.clockOutTime.toLocaleTimeString()
    );
  }

  clear() {
    this.clockInTime = undefined;
    this.clockOutTime = undefined;
    console.log('Clock-in and clock-out times cleared');
  }
}
