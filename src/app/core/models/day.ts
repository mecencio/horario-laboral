import { IDay } from "../interfaces/i-day";
import { ISchedule } from "../interfaces/i-schedule";

export class Day implements IDay {
    name: string;
    schedule: ISchedule;
    holiday: boolean;
    license: boolean;
    trackable?: boolean;

    constructor(name: string, schedule: ISchedule, holiday: boolean = false, license: boolean = false) {
        this.name = name;
        this.schedule = schedule;
        this.holiday = holiday;
        this.license = license;

        const defaultTrackable = name.toLowerCase() !== 'domingo' && name.toLowerCase().replace('á', 'a') !== 'sabado';
        this.trackable = defaultTrackable;
    }
}