import { TestBed } from '@angular/core/testing';

import { WorkdayService } from './workday.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { ValidWorkdayHours } from '../types/types';
import { VALID_WORKDAY_HOURS } from '../constants/valid-hours';

describe('WorkdayService', () => {
  let service: WorkdayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkdayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('WorkdayService', () => {
  const STORAGE_KEY = 'preferredWorkdayHours';
  const DEFAULT_HOURS: ValidWorkdayHours = 7.5;

  beforeEach(() => {
    localStorage.clear();
  });

  it('should load default hours if nothing is in localStorage', () => {
    localStorage.removeItem(STORAGE_KEY);
    const service = TestBed.inject(WorkdayService);
    expect(service.getWorkdayHours()).toBe(DEFAULT_HOURS);
  });

  it('should load valid hours from localStorage', () => {
    const validHour = VALID_WORKDAY_HOURS[0];
    localStorage.setItem(STORAGE_KEY, validHour.toString());
    const service = TestBed.inject(WorkdayService);
    expect(service.getWorkdayHours()).toBe(validHour);
  });

  it('should fallback to default if localStorage has invalid value', () => {
    localStorage.setItem(STORAGE_KEY, '999');
    const service = TestBed.inject(WorkdayService);
    expect(service.getWorkdayHours()).toBe(DEFAULT_HOURS);
  });

  it('should set and persist valid workday hours', () => {
    const service = TestBed.inject(WorkdayService);
    const newHour = VALID_WORKDAY_HOURS[1];
    service.setWorkdayHours(newHour);
    expect(service.getWorkdayHours()).toBe(newHour);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(newHour.toString());
  });

  it('should emit new value on workdayHours$ observable', fakeAsync(() => {
    const service = TestBed.inject(WorkdayService);
    let emitted: ValidWorkdayHours | undefined;
    service.workdayHours$.subscribe(val => emitted = val);
    const newHour = VALID_WORKDAY_HOURS[1];
    service.setWorkdayHours(newHour);
    tick();
    expect(emitted).toBe(newHour);
  }));

  it('should reset to default hours', () => {
    const service = TestBed.inject(WorkdayService);
    const newHour = VALID_WORKDAY_HOURS[1];
    service.setWorkdayHours(newHour);
    service.resetToDefault();
    expect(service.getWorkdayHours()).toBe(DEFAULT_HOURS);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(DEFAULT_HOURS.toString());
  });
});
