import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-day-tracker',
  imports: [
    ButtonModule,
  ],
  templateUrl: './day-tracker.component.html',
  styleUrl: './day-tracker.component.scss'
})
export class DayTrackerComponent {
  clockInTime: Date | null = null;
  clockOutTime: Date | null = null;

  clockIn() {
    this.clockInTime = new Date();
    console.log('Clock-in registered ' + this.clockInTime.toLocaleTimeString());
  }

  clockOut() {
    this.clockOutTime = new Date();
    console.log('Clock-out registered ' + this.clockOutTime.toLocaleTimeString());
  }
}
