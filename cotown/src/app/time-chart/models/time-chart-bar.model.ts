export class TimeChartBar {
    // Set
    id!: number;
    code: string = '';
    color: string = '';
    lock: boolean = false;
    datefrom: Date = new Date();
    dateto: Date = new Date();
    type: string = '';
    text: string = '';
    tooltip: string = '';

    // Calculated
    from: number = 0;
    to: number = 0;
    styles: string = '';
}