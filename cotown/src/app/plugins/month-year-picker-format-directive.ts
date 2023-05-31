import { Directive } from "@angular/core";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

export const FORMAT_MY = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: "[MonthYearPickerFormat]",
  providers: [
    { provide: DateAdapter,useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_MY }
  ]
})

export class MonthYearPickerFormatDirective {
}