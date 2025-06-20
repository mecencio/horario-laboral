import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { IDay } from '../interfaces/i-day';
import { Day } from '../models/day';
import { Schedule } from '../models/schedule';
import { VALID_DAYS } from '../constants/valid-days';
import { DayError } from '../errors/day.error';
import { SupportedLang } from '../types/supported-langs';

@Injectable({
  providedIn: 'root',
})
export class WeekService {
  private readonly STORAGE_KEY = 'week';
  private daysSubject = new BehaviorSubject<IDay[]>([]);
  private lang : SupportedLang;

  public days$ = this.daysSubject.asObservable();

  constructor() {
    this.lang = this.getCurrentLang();
    this.loadFromStorage();
  }

  /**
   * Determines the current language setting of the user's browser.
   *
   * @remarks
   * This method currently checks if the browser's language starts with 'en' to return 'en' (English),
   * otherwise it defaults to 'es' (Spanish).
   *
   * @returns {string} The detected language code, either 'en' or 'es'.
   */
  private getCurrentLang(): SupportedLang {
    // TODO: Implement a more robust language detection mechanism if needed.
    // For now, we assume the language is either English or Spanish based on the browser's language setting.
    return navigator.language.startsWith('en') ? 'en' : 'es';
  }

  /**
   * Checks if the provided day string is a valid day according to the `VALID_DAYS` list.
   *
   * @param day - The day string to validate.
   * @returns `true` if the day is valid; otherwise, `false`.
   */
  private isValidDay(day: string): boolean {
    const lang = this.lang;
    if (!VALID_DAYS[lang]) {
      throw new Error(`Unsupported language: ${lang}`);
    }
    return VALID_DAYS[lang]?.includes(day) ?? false;
  }

  /**
   * Generates a default week consisting of valid days, each initialized with a new `Day` instance.
   * Each `Day` is constructed using its name and a default `Schedule` with undefined start and end times.
   *
   * @returns {IDay[]} An array of `IDay` objects representing the default week.
   */
  private generateDefaultWeek(): IDay[] {
    const lang = this.lang;
    if (!VALID_DAYS[lang]) {
      throw new Error(`Unsupported language: ${lang}`);
    }
    return VALID_DAYS[lang].map(
      (name) => new Day(name, new Schedule(undefined, undefined))
    );
  }

  /**
   * Reconstructs an array of `IDay` objects from their raw storage representation.
   *
   * @param raw - An array of raw objects representing days, typically retrieved from storage.
   * Each object should contain properties for `name`, `schedule`, `holiday`, and `license`.
   * @returns An array of `IDay` instances, each created from the corresponding raw object.
   */
  private reviveDaysFromStorage(raw: any[]): IDay[] {
    if (!Array.isArray(raw)) {
      throw new Error('Invalid data format for days. Expected an array.');
    }
    return raw
    .filter((d) => d && d.name && this.isValidDay(d.name))
    .map(
      (d) =>
        new Day(
          d.name,
          new Schedule(d.schedule?.entry, d.schedule?.exit),
          d.holiday,
          d.license
        )
    );
  }

  /**
   * Loads the week data from local storage and updates the days subject.
   * If data exists in local storage under the specified storage key, it parses and revives the data.
   * Otherwise, it generates a default week.
   * The resulting days are emitted to the daysSubject observable.
   *
   * @private
   */
  private loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const days = data
      ? this.reviveDaysFromStorage(JSON.parse(data))
      : this.generateDefaultWeek();
    this.daysSubject.next(days);
  }

  /**
   * Retrieves the list of days for the week from local storage if available,
   * otherwise returns a default list of weekdays with empty schedules.
   *
   * @returns {Observable<IDay[]>} An observable emitting an array of `IDay` objects,
   * either loaded from local storage or initialized with default values.
   */
  getDays(): IDay[] {
    return [...this.daysSubject.getValue()];
  }

  /**
   * Stores the provided array of days in the browser's localStorage.
   *
   * @param days - An array of `IDay` objects to be saved.
   */
  setDays(days: IDay[]): void {
    if (!Array.isArray(days)) {
      throw new Error('Invalid days array provided.');
    } else {
      const invalid = days.find((day) => !this.isValidDay(day.name));
      if (invalid) {
        throw DayError.invalid(invalid.name, this.lang);
      }
    }
    this.daysSubject.next(days);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(days));
  }

  /**
   * Removes the stored days data from local storage.
   *
   * This method deletes the item associated with the `STORAGE_KEY` from the browser's local storage,
   * effectively clearing any previously saved days information.
   */
  clearDays(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Retrieves a day by its identifier.
   *
   * @param id - The identifier of the day to retrieve.
   * @returns An Observable that emits the found `IDay` object if it exists,
   *          or a new `Day` instance with the given id and an empty `Schedule` if not found.
   */
  getDayById(id: string): Observable<IDay> {
    if (!this.isValidDay(id)) {
      throw DayError.invalid(id, this.lang);
    }
    return this.days$.pipe(
      map((days: IDay[]) => {
        const found = days.find((day) => day.name === id);
        if (found) {
          return found;
        }
        return new Day(id, new Schedule(undefined, undefined));
      })
    );
  }

  /**
   * Updates an existing day in the collection of days.
   *
   * @param day - The day object to update. Must have a valid `name` identifier.
   * @returns An Observable that emits the updated day object.
   * @throws Error if the provided day name is invalid or if the day is not found in the collection.
   */
  updateDay(day: IDay): Observable<IDay> {
    if (!this.isValidDay(day.name)) {
      throw DayError.invalid(day.name, this.lang);
    }
    return this.days$.pipe(
      map((days: IDay[]) => {
        const idx = days.findIndex((d) => d.name === day.name);
        if (idx !== -1) {
          days[idx] = day;
          this.setDays(days);
          return day;
        } else {
          throw DayError.notFound(day.name, this.lang);
        }
      })
    );
  }

  /**
   * Retrieves an observable emitting an array of days that are trackable.
   *
   * This method filters the list of days returned by `getDays()` to include only those
   * where the `trackable` property is not explicitly set to `false`.
   *
   * @returns {Observable<IDay[]>} An observable that emits an array of trackable `IDay` objects.
   */
  getTrackableDays(): Observable<IDay[]> {
    return this.days$.pipe(
      map((days) => days.filter((day) => day.trackable !== false))
    );
  }

  /**
   * Resets the week to its default state.
   *
   * This method generates a default week using `generateDefaultWeek()`,
   * updates the current days with the default values via `setDays()`,
   * and returns an observable emitting the default week array.
   *
   * @returns {Observable<IDay[]>} An observable that emits the default week array.
   */
  resetToDefaultWeek(): Observable<IDay[]> {
    const defaultWeek = this.generateDefaultWeek();
    this.setDays(defaultWeek);
    return of(defaultWeek);
  }
}
