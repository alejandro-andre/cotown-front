import { TimeChartBar } from "./time-chart-bar.model";

export class TimeChartRow {
    id!: number;
    booking_id!: number;
    code: string = '';
    info: string = '';
    details: string = '';
    notes: string = '';
    highlight: string | null = null;
    style: string = '';
    bars: TimeChartBar[] = [];
    selected: boolean = false;
    checked: boolean = false;
}