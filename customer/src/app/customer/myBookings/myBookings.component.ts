import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './myBookings.component.html',
  styleUrls: ['./myBookings.component.scss']
})

export class MyBookingsComponent {
  constructor(
    public customerService: CustomerService,
    private router: Router,
  ) {}

  public dataSource: Array<any>  = [];

  get bookings():Array<any> {
    return this.customerService.customer.bookings;
  }

  getComposedName(data: any): string {
    if (data !== undefined && data.code !== undefined && data.name !== undefined) {
      return `${data.code}, ${data.name}`;
    } else {
      return data?.code || data.name || '';
    }
  }

  getResourceCode(resource: { code: string, id: number }): string {
    if(resource) {
      return resource?.code || ''
    }

    return '';
  }

  public displayedColumns: Array<string> = ['recurso', 'desde', 'hasta', 'estado', 'piso', 'plaza', 'tiporecurso'];
  clickedRow(row: any) {
    console.log(row);
  }
}
