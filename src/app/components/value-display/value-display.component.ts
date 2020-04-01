import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as c3 from 'c3';


@Component({
  selector: 'app-value-display',
  templateUrl: './value-display.component.html',
  styleUrls: ['./value-display.component.less']
})
export class ValueDisplayComponent implements OnInit, OnChanges {
  @Input() valueNumber: number;
  @Input() valueUnit: string;
  @Input() valueDate: string;
  @Input() valueLabel: string;

  visuallySimplifiedNumber() {
    const si = [
      { value: 1, symbol: '' },
      { value: 1E3, symbol: 'k' },
      { value: 1E6, symbol: 'M' },
      { value: 1E9, symbol: 'G' },
      { value: 1E12, symbol: 'T' },
      { value: 1E15, symbol: 'P' },
      { value: 1E18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (this.valueNumber >= si[i].value) {
        break;
      }
    }
    return (this.valueNumber / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol;
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }

  getNumberDisplay() {
    if (this.valueNumber.toFixed(2).length > 5) {
      return this.visuallySimplifiedNumber();
      return this.valueNumber.toFixed(2);
    } else {
      return this.valueNumber.toFixed(2);
    }
  }

}
