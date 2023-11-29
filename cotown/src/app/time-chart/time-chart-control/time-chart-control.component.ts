import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TimeChartRow } from '../models/time-chart-row.model';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-time-chart-control',
  templateUrl: './time-chart-control.component.html',
  styleUrls: ['./time-chart-control.component.scss']
})
export class TimeChartControlComponent implements OnChanges {

  // Inputs
  @Input() rows: TimeChartRow[] = [];
  @Input() now!: Date;
  @Input() from!: Date;
  @Input() to!: Date;
  @Input() sel!: string;
  @Input() max!: number;
  @Output() onSelectAvailable: EventEmitter<{id: number, Code: string, check: boolean}> = new EventEmitter();

  // Timechart header info
  public header: {date: string, month: number, start: number, end: number}[] = [];
  public days: {day: string, holiday: boolean, month: number}[] = [];
  public markerFrom: number = -1;
  public markerTo: number = -1;

  ONEDAY: number = (1000*60*60*24);

  // Constructor
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // Start on mondays
    this.now.setTime(this.now.getTime() - (this.ONEDAY * this.getDay(this.now)))

    // Set headers
    this.setHeader(this.now);

    // Set rows and bars
    this.moveBars();
  }

  // Generate header
  private setHeader(date: Date) {

    // Marker
    if (this.from != null && this.to != null) {
      this.markerFrom = Math.floor((this.from.getTime() - this.now.getTime()) / (this.ONEDAY));
      this.markerTo = Math.floor((this.to.getTime() - this.now.getTime()) / (this.ONEDAY));
    }

    // Dates
    this.header = [];
    this.days = [];
    let month = -1;
    for (var i = 0; i < 70; i++ ) {
      const fecha = new Date(date.getTime() + (this.ONEDAY*i));
      if (month != fecha.getMonth()) {
        const dmin = fecha.getDate();
        const dmax = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
        const j = Math.min(1 + i + dmax - dmin, 70);
        this.header.push({
          date: (j - i) < 4 ? '' : fecha.toLocaleDateString('es-ES', {month: 'short', year: 'numeric'}), 
          month: fecha.getMonth() % 2, 
          start: i, 
          end: j
        });
        month = fecha.getMonth();
      }
      this.days.push({
        day: fecha.getDate().toString(), 
        holiday: fecha.getDay() == 0 || fecha.getDay() == 6,
        month: fecha.getMonth() % 2
      });
    }
  }

  // Calculate bars position
  private moveBars() {

    // Move each bar
    for (let row of this.rows) {

      // Sort bars
      row.bars.sort(function(a, b) {
        return new Date(a.datefrom).getTime() - new Date(b.datefrom).getTime();
      });

      // Move each bar
      for (let bar of row.bars) {

        // Dates
        const now   = Math.floor(this.now.getTime() / (this.ONEDAY));
        const dfrom = 1 + Math.floor(bar.datefrom.getTime() / (this.ONEDAY)) - now;
        const dto   = 2 + Math.floor(bar.dateto.getTime() / (this.ONEDAY)) - now;

        // Show bar
        bar.styles = bar.type + ' show';

        // Set start
        if (dfrom < 1) {
          bar.from = 1;
          bar.styles += ' continue-left';
        } else if (dfrom > 70) {
          bar.from = 70;
        } else {
          bar.from = dfrom;
        }

        // Set end
        if (dto < 1) {
          bar.to = 1;
        } else if (dto > 70) {
          bar.to = 70;
          bar.styles += ' continue-right';
        } else {
          bar.to = dto;
        }

        // Set checkin/out dates
        bar.in = 0;
        bar.out = 0;
        if (bar.checkIn) {
          let din = 1 + Math.floor(bar.checkIn.getTime() / (this.ONEDAY) - now);
          if (dfrom > 0 && dfrom <= 70 && din > 70)
            din = 70;
          if (bar.from <= din && bar.from < 70 && din > 0 && din < 71)
            bar.in = din;
        }
        if (bar.checkOut) {
          let dout = 1 + Math.floor(bar.checkOut.getTime() / (this.ONEDAY) - now);
          if (bar.from < dout && bar.from < 70 && dout > 0 && dout < 71)
            bar.out = dout;
        }

        // Hide bar
        if ((bar.to - bar.from) < 1)
          bar.styles = 'hide';
      }
    }
  }

  isAvailable(row: any): boolean {
    if (!row.bars || !row.bars.length) {
      return false;
    }
    for (const elem of row.bars) {
      if (elem.type === 'available') {
        return true;
      }
    }
    return false;
  }

  emitRadio(event: MatRadioChange, row: TimeChartRow): void {
    for (const elemento of this.rows) {
      elemento.checked = false;
      if (elemento.id == row.id)
        elemento.checked = true;
    }
  }

  emitCheck(event: MatCheckboxChange, row: TimeChartRow): void {
    row.checked = !row.checked;
  }

  isCheckable(row: TimeChartRow) {
    let n = 0;
    for (const elemento of this.rows) {
      if (elemento.checked)
        n = n + 1;
    }
    if (n >= this.max) {
      return row.checked;
    }
    return this.isAvailable(row) || row.selected;
  }

  private getDay(date: Date): number {
    let n = date.getDay() - 1;
    if (n < 0)
      n = 6;
    return n;
  }

  public go_booking(link: string) {
    if (link == '')
      return;
    parent.history.pushState("", "", link);
    parent.history.go(-1);
    parent.history.go(1);
    parent.history.pushState("", "", link);
    parent.history.go(-1);
    parent.history.go(1);
  }

}
