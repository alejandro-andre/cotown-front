import { Component } from '@angular/core';
import { TimeChartBar } from 'src/app/time-chart/models/time-chart-bar.model';
import { TimeChartLine } from 'src/app/time-chart/models/time-chart-line.model';

@Component({
  selector: 'app-home',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent {

  // Bars
  public bars: TimeChartBar[] = [];

  // Dates
  public now: Date = new Date();
  public from: Date = new Date('2023-04-15');
  public to: Date = new Date('2023-04-30');

  // Colors
  private colors: any = {
    confirmada: '#002B5B',
    solicitud: '#1A5F7A',
    checkin: '#159895',
    checkout: '#57C5B6',
    finalizada: '#537FE7'
  };
  
  // Types
  private types: any = {
    piso: 'title_h1',
    habitacion: 'title_h2',
    plaza: 'title_h3'
  };
  
  // Resources
  private resources = [
    { 'Resource_code': 'ART030.AT.00',        'Resource_type': 'piso',       'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H01',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H02',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H03',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H04',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H05',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H05.P1', 'Resource_type': 'plaza',      'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H05.P2', 'Resource_type': 'plaza',      'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H06',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H06.P1', 'Resource_type': 'plaza',      'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H06.P2', 'Resource_type': 'plaza',      'Resource_info': '...' },
  ]

  // Bookings
  private bookings = [
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': '',
      'Booking_date_from': '2023-04-01', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00'
    },
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': '',
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-06-20',
      'Resource_code': 'ART030.AT.00'
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'confirmada',
      'Booking_date_from': '2023-04-01', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00.H01',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'solicitud',
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-05-11',
      'Resource_code': 'ART030.AT.00.H02',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'checkin', 
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-04-20',
      'Resource_code': 'ART030.AT.00.H03',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'checkout', 
      'Booking_date_from': '2023-04-21', 'Booking_date_to': '2023-06-20',
      'Resource_code': 'ART030.AT.00.H03',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': 'capex', 'Booking_lock': true, 'Booking_status': 'unavailable', 
      'Booking_date_from': '2023-03-15', 'Booking_date_to': '2023-04-23',
      'Resource_code': 'ART030.AT.00.H04'
    },
    {
      'Booking_code': '4321', 'Booking_lock': false, 'Booking_status': 'checkin', 
      'Booking_date_from': '2023-04-26', 'Booking_date_to': '2023-05-20',
      'Resource_code': 'ART030.AT.00.H04',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': '', 
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-05-11',
      'Resource_code': 'ART030.AT.00.H05',
    },
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': 'finalizada', 
      'Booking_date_from': '2023-04-21', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00.H05',
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'confirmada', 
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-05-11',
      'Resource_code': 'ART030.AT.00.H05.P1',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'solicitud', 
      'Booking_date_from': '2023-04-21', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00.H05.P2',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '', 'Booking_lock': false, 'Booking_status': 'available', 
      'Booking_date_from': '2023-04-15', 'Booking_date_to': '2023-04-30',
      'Resource_code': 'ART030.AT.00.H06'
    },
    {
      'Booking_code': '', 'Booking_lock': false, 'Booking_status': 'available', 
      'Booking_date_from': '2023-04-15', 'Booking_date_to': '2023-04-30',
      'Resource_code': 'ART030.AT.00.H06.P1'
    },
    {
      'Booking_code': '', 'Booking_lock': false, 'Booking_status': 'available', 
      'Booking_date_from': '2023-04-15', 'Booking_date_to': '2023-04-30',
      'Resource_code': 'ART030.AT.00.H06.P2'
    }
  ]

  // Constructor
  constructor() {
    this.generateBars();
  }
  
  // Go 1 week bacwards
  goBackward() {
    const date = new Date(this.from.getTime() - (1000*60*60*24*7));
    this.now = date;
  }

  // Go 1 week forward
  goForward() {
    const date = new Date(this.now.getTime() + (1000*60*60*24*7));
    this.now = date;
  }

  // Generate bars for the time chart
  generateBars() {

    var bar!: TimeChartBar;

    // Generate bars
    for (const r of this.resources) {
        bar = new TimeChartBar();
        bar.code = r.Resource_code;
        bar.info = r.Resource_info
        bar.style = this.types[r.Resource_type];
        this.bars.push(bar);
    }

    // Generate lines
    for (var b of this.bookings) {

      // Dates
      let line: TimeChartLine = new TimeChartLine();
      line.datefrom = new Date(b.Booking_date_from);
      line.dateto = new Date(b.Booking_date_to);

      // Available slot
      if (b.Booking_status === 'available') {
        line.lock = true;
        line.color = "rgba(100, 255, 100, 0.3)";
        line.type = 'available';
      } 
      
      // Capex
      else if (b.Booking_status === 'unavailable') {
        line.lock = true;
        line.code = b.Booking_code;
        line.color = "rgba(255, 100, 100, 0.7)";
        line.type = 'stripes';
      } 
      
      // Lock booking
      else if (b.Booking_lock) {
        line.lock = true;
        line.color = "#c0c0c0";
        line.type = 'stripes';
      } 
      
      // Real booking
      else {
        line.lock = false;
        line.code = b.Booking_code;
        line.color = this.colors[b.Booking_status];
        line.text = b.Customer_name 
                  + ' - ' + b.Customer_gender 
                  + ' - ' + b.Customer_country 
                  + ' - ' + b.Customer_email 
                  + ' - ' + b.Customer_phone; 
        line.tooltip = `
                  <div><span class="tiphead">${b.Booking_code}</span></div>
                  <div><span class="tipfield">${b.Booking_status}</span></div>
                  <div><span class="tipfield">${b.Booking_date_from} a ${b.Booking_date_to}</span></div>
                  <div><span class="tipfield">Nombre:</span><span>${b.Customer_name}</span></div>
                  <div><span class="tipfield">Edad/Género:</span><span>${b.Customer_gender}</span></div>
                  <div><span class="tipfield">País:</span><span>${b.Customer_country}</span></div>
                  <div><span class="tipfield">Teléfono:</span><span>${b.Customer_phone}</span></div>
                  <div><span class="tipfield">Email:</span><span>${b.Customer_email}</span></div>`
      }

      // Add line to proper bar
      for (var bar of this.bars) { 
        if (bar.code == b.Resource_code) {
          bar.lines.push(line);
          break;
        }
      }
      
    }

    // Consolidate bar lines
    for (var bar of this.bars) {
      if (bar.lines.length > 1 && bar.lines[0].lock) {
        bar.lines = this.consolidateIntervals(bar.lines);
      }
    }
    
  }

  // Consolidate bookings for lock types
  consolidateIntervals(intervals: TimeChartLine[]) {

    // Sort by date
    intervals.sort((a, b) => a.datefrom.getTime() - b.datefrom.getTime());

    // List of resulting consolidated bookings
    let consolidatedIntervals = [];

    // Get first booking as current
    let currentInterval = intervals[0];
  
    // Loop thru all bookings
    for (let i = 1; i < intervals.length; i++) {

      // Next interval overlaps current one
      if (intervals[i].datefrom <= currentInterval.dateto) {

        // Extend current interval
        if (currentInterval.dateto < intervals[i].dateto) {
          currentInterval.dateto = intervals[i].dateto;
        }
      }

      // Next interval doesnt overlap, its a new one
      else {
        consolidatedIntervals.push(currentInterval);
        currentInterval = intervals[i];
      }
    }

    // Add last interval to list and return 
    consolidatedIntervals.push(currentInterval);
    return consolidatedIntervals;
  }

}
