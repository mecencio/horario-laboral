import { TestBed } from '@angular/core/testing';

import { WeekService } from './week.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { IDay } from '../interfaces/i-day';
import { Day } from '../models/day';
import { Schedule } from '../models/schedule';
import { VALID_DAYS } from '../constants/valid-days';
import { DayError } from '../errors/day.error';

describe('WeekService', () => {
  let service: WeekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('WeekService methods', () => {
  let service: WeekService;
  let storage: Storage;

  beforeEach(() => {
    storage = window.localStorage;
    spyOn(storage, 'getItem').and.callFake((key: string) => null);
    spyOn(storage, 'setItem').and.callThrough();
    spyOn(storage, 'removeItem').and.callThrough();
    service = TestBed.inject(WeekService);
  });

  afterEach(() => {
    storage.clear();
  });

  // it('getDays should return default days if storage is empty', () => {
  //   const days = service.getDays();
  //   expect(Array.isArray(days)).toBeTrue();
  //   expect(days.length).toBe(VALID_DAYS[service['lang']].length);
  //   expect(days[0]).toEqual(jasmine.any(Day));
  // });

  // it('setDays should store valid days and update observable', () => {
  //   const days = service.getDays();
  //   service.setDays(days);
  //   expect(storage.setItem).toHaveBeenCalled();
  //   expect(service.getDays()).toEqual(days);
  // });

  // it('setDays should throw error for invalid days', () => {
  //   const days = service.getDays();
  //   (days[0] as any).name = 'InvalidDay';
  //   try {
  //     service.setDays(days);
  //   } catch (e) {
  //     expect(e).toBeInstanceOf(DayError);
  //     expect((e as DayError).type).toBe('invalid');
  //   }
  // });

  // it('clearDays should remove item from storage', () => {
  //   service.clearDays();
  //   const newService = TestBed.inject(WeekService);
  //   expect(newService.getDays().length).toBeGreaterThan(0);
  // });

  // it('getDayById should return a day if exists', fakeAsync(() => {
  //   const days = service.getDays();
  //   const id = days[0].name;
  //   let result: IDay | undefined;
  //   service.getDayById(id).subscribe((d) => (result = d));
  //   tick();
  //   expect(result?.name).toBe(id);
  // }));

  // it('getDayById should return new Day if not found', fakeAsync(() => {
  //   const id = VALID_DAYS[service['lang']][0];
  //   service.setDays([]);
  //   let result: IDay | undefined;
  //   service.getDayById(id).subscribe((d) => (result = d));
  //   tick();
  //   expect(result).toEqual(jasmine.any(Day));
  //   expect(result?.name).toBe(id);
  // }));

  // it('getDayById should throw error for invalid id', () => {
  //   expect(() => service.getDayById('InvalidDay')).toThrowError();
  // });

  it('updateDay should update an existing day', fakeAsync(() => {
    const days = service.getDays();
    service.setDays(days);
    const entryDate = new Date();
    entryDate.setHours(8, 0, 0, 0);
    const exitDate = new Date();
    exitDate.setHours(17, 0, 0, 0);
    const updated = new Day(days[0].name, new Schedule(entryDate, exitDate));

    let result: IDay | undefined;
    service.updateDay(updated).subscribe((d) => (result = d));
    tick();

    expect(result).toEqual(updated);

    const persisted = service.getDays().find(d => d.name === updated.name);
    expect(persisted).toEqual(updated);
  }));

  it('updateDay should only modify the targeted day', fakeAsync(() => {
    const originalDays = service.getDays();
    const entryDate = new Date();
    entryDate.setHours(9, 0, 0, 0);
    const exitDate = new Date();
    exitDate.setHours(17, 0, 0, 0);
    const modifiedDay = new Day(
      originalDays[0].name,
      new Schedule(entryDate, exitDate)
    );

    service.updateDay(modifiedDay).subscribe();
    tick();

    const updatedDays = service.getDays();
    expect(updatedDays[0]).toEqual(modifiedDay);

    for (let i = 1; i < updatedDays.length; i++) {
      expect(updatedDays[i]).toEqual(originalDays[i]);
    }
  }));

  it('updateDay should throw error if day not found', fakeAsync(() => {
    const badDay = new Day('NonExistent', new Schedule(undefined, undefined));
    expect(() => {
      service.updateDay(badDay).subscribe();
      tick();
    }).toThrow();
  }));

  it('getTrackableDays should filter out non-trackable days', fakeAsync(() => {
    const days = service.getDays();
    (days[0] as any).trackable = false;
    service.setDays(days);
    let result: IDay[] = [];
    service.getTrackableDays().subscribe((d) => (result = d));
    tick();
    expect(result.find((d) => d.name === days[0].name)).toBeUndefined();
  }));

  it('resetToDefaultWeek should reset and emit default week', fakeAsync(() => {
    service.setDays([]);
    let result: IDay[] = [];
    service.resetToDefaultWeek().subscribe((d) => (result = d));
    tick();
    expect(result.length).toBe(VALID_DAYS[service['lang']].length);
    expect(result[0]).toEqual(jasmine.any(Day));
  }));

  it('days$ should emit updated values when setDays is called', fakeAsync(() => {
    const newDays = service.getDays().map(d => new Day(d.name, d.schedule));
    let emitted: IDay[] = [];
    service.days$.subscribe(d => emitted = d);

    service.setDays(newDays);
    tick();

    expect(emitted).toEqual(newDays);
  }));
});
