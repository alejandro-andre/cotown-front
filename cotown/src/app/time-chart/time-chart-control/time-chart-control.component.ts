import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

  // Timechart header info
  public header: string[] = [];
  public days: string[] = [];
  public markerFrom: number = -1;
  public markerTo: number = -1;

  // Constructor
  constructor() {;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Start on mondays
    this.now.setTime(this.now.getTime() - (1000*60*60*24*this.now.getDay()))

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
    for (var i = 0; i < 10; i++ ) {
      const fecha = new Date(date.getTime() + (1000*60*60*24*7*i));
      this.header.push(fecha.toLocaleDateString('es-ES', {day: '2-digit', month: 'short'}));
      this.days.push(...['L','M','X','J','V','S','D',]);
    }
  }

  // Calculate bars position
  private moveLines() {

    // Move each line
    for (var bar of this.bars) {
      for (var line of bar.lines) {
      
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
}
