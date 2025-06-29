import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'day', pathMatch: 'full' },
  {
    path: 'day',
    loadComponent: () =>
      import('./features/day-tracker/day-tracker.component').then(
        (m) => m.DayTrackerComponent
      ),
  },
];
