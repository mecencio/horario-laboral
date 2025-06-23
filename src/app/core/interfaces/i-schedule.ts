export interface ISchedule {
    /**
     * The entry time for the schedule.
     * @type {Date | undefined}
     */
    clockInTime?: Date;

    /**
     * The exit time for the schedule.
     * @type {Date | undefined}
     */
    clockOutTime?: Date;

    /**
     * Calculates the difference in minutes between the clock-in and clock-out times.
     * @returns {number} The difference in minutes between clock-in and clock-out.
     * Returns 0 if either clock-in or clock-out is not defined.
     */
    calculateDifference(): number;
}
