import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-single-bar-proportion',
  templateUrl: './single-bar-proportion.component.html',
  styleUrls: ['./single-bar-proportion.component.less']
})
export class SingleBarProportionComponent implements  OnInit, OnChanges, AfterViewInit {
  @Input() valueNumbers: number[];
  @Input() valueLabels: string[];
  @Input() valueUnit: string;
  @Input() colorThemes: string[];

  chartId: string;
  valueLabel: string;

  constructor() {
    this.chartId = `barChart${Math.floor((Math.random() * 6) + 1)}`;
    this.valueLabel = 'Unknown';
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshDisplay();
  }

  ngAfterViewInit(): void {
    this.refreshDisplay();
  }

  refreshDisplay(): void {
    this.valueLabel = `Proportion of ${this.valueLabels.join(' as opposed to ')}`;
    c3.generate({
      bindto: `#${this.chartId}`,
      data: {
        columns: this.valueLabels.map(label => [label, this.valueNumbers[this.valueLabels.indexOf(label)]]),
        type: 'bar',
        groups: [
            this.valueLabels
        ],
        order: null
      },
      axis: {
        rotated: true,
        x: {show: false},
        y: {show: false}
      },
      bar: {
        width: 20
      },
      color: {
        pattern: this.colorThemes
      },
      legend: {
        show: true
      },
      size: {
        height: 50,
      }
    });
  }

  visuallySimplifiedNumbers() {
    return this.valueNumbers.map(num => {
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
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(4).replace(rx, '$1') + si[i].symbol;
    });
  }
}
