import { ISchedule } from "./i-schedule";

export interface IDay {
    /**
     * The name of the day, e.g., "Monday", "Tuesday", etc.
     */
    name: string;

    /**
     * The schedule for the day, which includes entry and exit times.
     */
    schedule: ISchedule;

    /**
     * Indicates whether the day is a holiday.
     */
    holiday: boolean;

    /**
     * Indicates whether the day is a license day.
     */
    license: boolean;

    /**
     * Indicates whether the day is trackable.
     */
    trackable?: boolean;
}
