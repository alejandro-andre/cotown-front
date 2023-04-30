import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TimeChartRow } from '../models/time-chart-row.model';
import { WindowRef } from 'src/app/services/window-ref.service';

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
  @Output() onSelectAvailable: EventEmitter<{ Code: string, id: number }> = new EventEmitter();

  // Timechart header info
  public header: {date: string, month: number, start: number, end: number}[] = [];
  public days: {day: string, holiday: boolean, month: number}[] = [];
  public markerFrom: number = -1;
  public markerTo: number = -1;

  // Constructor
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // Start on mondays
    this.now.setTime(this.now.getTime() - (1000*60*60*24*this.getDay(this.now)))

    // Set headers
    this.setHeader(this.now);

    // Set rows and bars
    this.moveBars();
  }

  // Generate header
  private setHeader(date: Date) {

    // Marker
    if (this.from != null && this.to != null) {
      this.markerFrom = Math.ceil((this.from.getTime() - this.now.getTime()) / (1000*60*60*24));
      this.markerTo = Math.ceil((this.to.getTime() - this.now.getTime()) / (1000*60*60*24));
    }

    // Dates
    this.header = [];
    this.days = [];
    let month = -1;
    for (var i = 0; i < 70; i++ ) {
      const fecha = new Date(date.getTime() + (1000*60*60*24*i));
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
        const dfrom = Math.ceil((bar.datefrom.getTime() - this.now.getTime()) / (1000*60*60*24));
        const dto = 1 + Math.ceil((bar.dateto.getTime() - this.now.getTime()) / (1000*60*60*24));

        // Show bar
        bar.styles = bar.type + ' show';

        // Set start
        if (dfrom  < 0) {
          bar.from = 0;
          bar.styles += ' continue-left';
        } else if (dfrom > 70) {
          bar.from = 70;
        } else {
          bar.from = dfrom;
        }

        // Set end
        if (dto < 0) {
          bar.to = 0;
        } else if (dto > 70) {
          bar.to = 70;
          bar.styles += ' continue-right';
        } else {
          bar.to = dto;
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

  emitSelectAvailableResource(row: TimeChartRow): void {
    this.onSelectAvailable.emit({ Code: row.code, id: row.id });
  }

  private getDay(date: Date): number {
    let n = date.getDay() - 1;
    if (n < 0)
      n = 6;
    return n;
  }

  public go_booking(code: string) {
    if (code == '' || code.charAt(0) == 'G')
      return;
    const u = "/admin/Booking.Booking/" + code + "/view";
    parent.history.pushState("", "", u);
    parent.history.go(-1);
    parent.history.go(1);
    parent.history.pushState("", "", u);
    parent.history.go(-1);
    parent.history.go(1);
  }

}
