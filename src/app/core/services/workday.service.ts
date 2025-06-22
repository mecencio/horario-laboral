import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VALID_WORKDAY_HOURS } from '../constants/valid-hours';
import { ValidWorkdayHours } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class WorkdayService {
  private readonly STORAGE_KEY = 'preferredWorkdayHours';
  private readonly DEFAULT_HOURS: ValidWorkdayHours = 7.5;

  private hoursSubject = new BehaviorSubject<ValidWorkdayHours>(
    this.loadHours()
  );
  public workdayHours$ = this.hoursSubject.asObservable();

  constructor() {}

  /**
   * Checks if the provided workday hours are valid by verifying
   * if they are included in the predefined list of valid workday hours.
   *
   * @param hours - The workday hours to validate.
   * @returns `true` if the hours are valid, otherwise `false`.
   */
  private isValidHours(hours: ValidWorkdayHours): boolean {
    return VALID_WORKDAY_HOURS.includes(hours);
  }

  /**
   * Loads the workday hours from local storage.
   *
   * Retrieves the stored value using the predefined storage key, parses it as a float,
   * and validates it as a `ValidWorkdayHours` value. If the stored value is invalid or not present,
   * returns the default workday hours.
   *
   * @returns {ValidWorkdayHours} The valid workday hours loaded from storage or the default value.
   */
  private loadHours(): ValidWorkdayHours {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const parsed = parseFloat(stored ?? '');
    return this.isValidHours(parsed as ValidWorkdayHours)
      ? (parsed as ValidWorkdayHours)
      : this.DEFAULT_HOURS;
  }

  /**
   * Retrieves the current valid workday hours from the internal subject.
   *
   * @returns {ValidWorkdayHours} The current value of workday hours.
   */
  getWorkdayHours(): ValidWorkdayHours {
    return this.hoursSubject.getValue();
  }

  /**
   * Sets the workday hours after validating the provided value.
   *
   * @param hours - The number of workday hours to set. Must be a valid value as defined by `VALID_WORKDAY_HOURS`.
   * @throws {Error} Throws an error if the provided hours are not valid.
   *
   * Updates the internal hours subject and persists the value to localStorage.
   */
  setWorkdayHours(hours: ValidWorkdayHours): void {
    this.hoursSubject.next(hours);
    localStorage.setItem(this.STORAGE_KEY, hours.toString());
  }

  /**
   * Resets the workday hours to their default values.
   *
   * This method sets the workday hours to the predefined default hours
   * specified by `DEFAULT_HOURS`.
   */
  resetToDefault(): void {
    this.setWorkdayHours(this.DEFAULT_HOURS);
  }
}
