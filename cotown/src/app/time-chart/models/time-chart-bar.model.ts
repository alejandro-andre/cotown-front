import { TimeChartLine } from "./time-chart-line.model";

export class TimeChartBar {
    id!: number;
    code: string = '';
    info: string = '';
    style: string = '';
    lines: TimeChartLine[] = [];
}