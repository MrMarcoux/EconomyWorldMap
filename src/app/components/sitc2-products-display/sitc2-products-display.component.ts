import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { SITC2ProductGroups } from 'src/app/models/country';

@Component({
  selector: 'app-sitc2-products-display',
  templateUrl: './sitc2-products-display.component.html',
  styleUrls: ['./sitc2-products-display.component.less']
})
export class SITC2ProductsDisplayComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() productGroups: SITC2ProductGroups;
  @Input() valueLabel: string;
  @Input() valueUnit: string;
  @Input() valueDate: string;
  @Input() colorTheme: string;

  readonly radarChartLabels = [
    'Agriculture',
    'Chemicals',
    'Food',
    'Fuels',
    'Manufactures',
    'Metals',
    'Textiles',
    'Machinery'
  ];

  readonly  radarChartOptions = {
    scale: {
      gridLines: {
        lineWidth: 1,
        color: 'black'
      },
      angleLines: {
        lineWidth: 1,
        color: 'black'
      },
      ticks: {
        callback(num) {
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
        }
      }
    },

    legend: {
       display: false
    }
  };

  radarChartData = [];

  constructor() {
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
    this.radarChartData = [
    {data: Object.values(this.productGroups),
           backgroundColor: `#${this.colorTheme.replace('#', '')}80`,
           borderColor: this.colorTheme, pointBackgroundColor: this.colorTheme,
           borderWidth: 2,
           pointBorderColor: this.colorTheme }
  ];

  }
}
