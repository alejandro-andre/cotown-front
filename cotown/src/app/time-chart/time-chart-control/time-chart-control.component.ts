import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TimeChartBar } from '../models/time-chart-bar.model';

@Component({
  selector: 'app-time-chart-control',
  templateUrl: './time-chart-control.component.html',
  styleUrls: ['./time-chart-control.component.scss']
})
export class TimeChartControlComponent implements OnChanges {

  // Inputs
  @Input() bars: TimeChartBar[] = [];
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
  constructor() {;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Start on mondays
    this.now.setTime(this.now.getTime() - (1000*60*60*24*this.getDay(this.now)))

    // Set headers
    this.setHeader(this.now);

    // Set bars and lines
    this.moveLines();
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
        this.header.push({
          date: fecha.toLocaleDateString('es-ES', {month: 'short', year: 'numeric'}), 
          month: fecha.getMonth() % 2, 
          start: i, 
          end: Math.min(i + dmax - dmin, 73)
        });
        month = fecha.getMonth();
      }
      this.days.push({
        day: fecha.getDate().toString(), 
        holiday: fecha.getDay() == 0 || fecha.getDay() == 6,
        month: fecha.getMonth() % 2
      });
    }
    console.log(this.header);
    console.log(this.days);
  }

  // Calculate bars position
  private moveLines() {

    // Move each line
    for (let bar of this.bars) {

      // Sort lines
      bar.lines.sort(function(a, b) {
        return new Date(a.datefrom).getTime() - new Date(b.datefrom).getTime();
      });

      // Move each line
      for (let line of bar.lines) {
        // Dates
        const dfrom = Math.ceil((line.datefrom.getTime() - this.now.getTime()) / (1000*60*60*24));
        const dto = 1 + Math.ceil((line.dateto.getTime() - this.now.getTime()) / (1000*60*60*24));

        // Show bar
        line.styles = line.type + ' show';

        // Set start
        if (dfrom  < 0) {
          line.from = 0;
          line.styles += ' continue-left';
        } else if (dfrom > 70) {
          line.from = 70;
        } else {
          line.from = dfrom;
        }

        // Set end
        if (dto < 0) {
          line.to = 0;
        } else if (dto > 70) {
          line.to = 70;
          line.styles += ' continue-right';
        } else {
          line.to = dto;
        }

        // Hide bar
        if ((line.to - line.from) < 1)
          line.styles = 'hide';
      }
    }
  }

  isAvailable(bar: any): boolean {
    if (!bar.lines || !bar.lines.length) {
      return false;
    }

    for (const elem of bar.lines) {
      if (elem.type === 'available') {
        return true;
      }
    }

    return false;
  }

  emitSelectAvailableResource(bar: TimeChartBar): void {
    this.onSelectAvailable.emit({ Code: bar.code, id: bar.id });
  }

  private getDay(date: Date): number {
    let n = date.getDay() - 1;
    if (n < 0)
      n = 6;
    return n;
  }
}
