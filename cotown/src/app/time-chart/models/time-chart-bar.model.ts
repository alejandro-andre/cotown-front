export class TimeChartBar {
    // Set
    id!: number;
    code: string = '';
    color: string = '';
    lock: boolean = false;
    datefrom: Date = new Date();
    dateto: Date = new Date();
    checkIn: Date | null = null;
    checkOut: Date | null = null;
    type: string = '';
    text: string = '';
    tooltip: string = '';
    link: string = '';

    // Calculated
    from: number = 0;
    to: number = 0;
    in: number = 0;
    out: number = 0;
    styles: string = '';
}