export interface ISchedule {
    entry?: Date;
    exit?: Date;

    calculateDifference(): number;
}
