import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-progress-display',
  templateUrl: './progress-display.component.html',
  styleUrls: ['./progress-display.component.less']
})
export class ProgressDisplayComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() valuesDict: { [year: string]: number; };
  @Input() valueLabel: string;
  @Input() valueUnit: string;
  @Input() colorTheme: string;

  chartId: string;

  constructor() {
    this.chartId = `chart${Math.floor((Math.random() * 6000) + 1)}`;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.refreshDisplay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshDisplay();
  }

  latest(): string {
    return Object.values(this.valuesDict).slice(-1)[0].toFixed(2);
  }

  refreshDisplay(): void {
    c3.generate({
      bindto: `#${this.chartId}`,
      size: {
        height: 220,
        width: 240
      },
      data: {
        type: 'area',
        x: 'x',
        columns: [
          ['x', ...Object.keys(this.valuesDict)],
          ['values', ...Object.values(this.valuesDict).map(val => val.toFixed(2))]
        ]
      },
      point: {
        show: false
      },
      axis: {
        x: {
          type: 'category',
          tick: {
            culling: {
              max: 8
            },
            rotate: -75,
            multiline: false
          }
        },
        y : {
          tick: {
              format(d) { return d + '%'; }
          }
      }
      },
      color: {
        pattern: [this.colorTheme]
      },
      legend: {
        show: false
      }
    });
  }
}
