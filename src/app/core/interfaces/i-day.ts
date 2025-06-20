import { ISchedule } from "./i-schedule";

export interface IDay {
    name: string;
    schedule: ISchedule;
    holiday: boolean;
    license: boolean;
    trackable?: boolean;
}
