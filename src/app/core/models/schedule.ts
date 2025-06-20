import { ISchedule } from "../interfaces/i-schedule";

export class Schedule implements ISchedule {
    entry?: Date;
    exit?: Date;

    constructor(entry: Date | undefined, exit: Date | undefined) {
        this.entry = entry;
        this.exit = exit;
    }

    /**
     * Calculates the difference in minutes between the `entry` and `exit` times.
     *
     * @returns {number} The difference in minutes between `entry` and `exit`.
     * Returns 0 if either `entry` or `exit` is not defined.
     */
    calculateDifference(): number {
        if (!this.entry || !this.exit) return 0;

        return (this.exit.getTime() - this.entry.getTime()) / 60000;
    }
}