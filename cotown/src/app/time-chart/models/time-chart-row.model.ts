import { TimeChartBar } from "./time-chart-bar.model";

export class TimeChartRow {
    id!: number;
    booking_id!: number;
    code: string = '';
    info: string = '';
    style: string = '';
    bars: TimeChartBar[] = [];
    checked: boolean = false;
}