import { Component, Input, OnInit } from '@angular/core';
import { TimeChartBar } from '../models/time-chart-bar.model';

@Component({
  selector: 'app-time-chart-control',
  templateUrl: './time-chart-control.component.html',
  styleUrls: ['./time-chart-control.component.scss']
})
export class TimeChartControlComponent implements OnInit {

  // Inputs
  @Input() bars: TimeChartBar[] = [];
  @Input() now: Date = new Date();

  // Gant header
  public header: string[] = [];
  public days: string[] = [];

  // Constructor
  constructor() {;
  }

  // Inits control
  ngOnInit(): void {

    // Set headers
    this.setHeader(this.now);

    // Set bars and lines
    this.moveLines();
  }

  // Generate header
  setHeader(date: Date) {

    // Start on mondays
    this.now.setTime(this.now.getTime() - (1000*60*60*24*this.now.getDay()))

    // Dates
    this.header = [];
    this.days = [];
    for (var i = 0; i < 10; i++ ) {
      const fecha = new Date(date.getTime() + (1000*60*60*24*7*i));
      this.header.push(fecha.toLocaleDateString('es-ES', {day: '2-digit', month: 'short'}));
      for (var j = 0; j < 7; j++) {
        const d = ((fecha.getDay() + j) % 7);
        this.days.push("LMXJVSD".charAt(d));
      }
    }
  }

  // Calculate bars position
  moveLines() {

    // Start on mondays
    this.now.setTime(this.now.getTime() - (1000*60*60*24*this.now.getDay()))

    // Move each line
    for (var bar of this.bars) {
      for (var line of bar.lines) {
      
        // Dates
        const dfrom = Math.ceil((line.datefrom.getTime() - this.now.getTime()) / (1000*60*60*24));
        const dto = 1 + Math.ceil((line.dateto.getTime() - this.now.getTime()) / (1000*60*60*24));

        // Show bar
        line.styles = line.type + ' show';

        // Set start
        if (dfrom < 0) {
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

  // Go a week bacwards
  backward(i: number = 7) {
    this.now.setTime(this.now.getTime() - (1000*60*60*24*i));
    this.setHeader(this.now);
    this.moveLines();
  }

  // Go a week forward
  forward(i: number = 7) {
    this.now.setTime(this.now.getTime() + (1000*60*60*24*i))
    this.setHeader(this.now);
    this.moveLines();
  }
  
}
