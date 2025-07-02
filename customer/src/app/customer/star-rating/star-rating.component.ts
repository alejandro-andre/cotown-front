import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ]
})

export class StarRatingComponent implements OnInit, ControlValueAccessor  {

  @Output() change = new EventEmitter<number>();
  @Input('stars') public stars: number = 10;
  @Input('of') public of: string = "de";
  
  public rating: number = 10;
  public ratingArr: any[] = [];

  constructor() {
  }

  ngOnInit() {
    for (let index = 0; index <= this.stars; index++) {
      this.ratingArr.push(index);
    }
  }

  onChange = (rating: number) => {};
  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  onTouched = () => {};
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.rating = obj;
  }

  onClick(rating: number) {
    this.rating = rating;
    this.onChange(rating);
    this.change.emit(rating);
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  getClasses(i: number): { [klass: string]: boolean } {
    return {
      selected: this.rating === i,
      ['color-' + i]: true
    };
  }

}