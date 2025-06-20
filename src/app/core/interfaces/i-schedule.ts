export interface ISchedule {
    /**
     * The entry time for the schedule.
     * @type {Date | undefined}
     */
    entry?: Date;

    /**
     * The exit time for the schedule.
     * @type {Date | undefined}
     */
    exit?: Date;

    /**
     * Calculates the difference in minutes between the entry and exit times.
     * @returns {number} The difference in minutes between entry and exit.
     * Returns 0 if either entry or exit is not defined.
     */
    calculateDifference(): number;
}
