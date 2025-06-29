import { ISchedule } from "../interfaces/i-schedule";

export class Schedule implements ISchedule {
    clockInTime?: Date;
    clockOutTime?: Date;

    constructor(clockInTime: Date | undefined, clockOutTime: Date | undefined) {
        this.clockInTime = clockInTime;
        this.clockOutTime = clockOutTime;
    }

    /**
     * Calculates the difference in minutes between the `clockInTime` and `clockOutTime`.
     *
     * @returns {number} The difference in minutes between `clockInTime` and `clockOutTime`.
     * Returns 0 if either `clockInTime` or `clockOutTime` is not defined.
     */
    calculateDifference(): number {
        if (!this.clockInTime || !this.clockOutTime) return 0;

        return (this.clockOutTime.getTime() - this.clockInTime.getTime()) / 60000;
    }
}