import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-title',
  templateUrl: './display-title.component.html',
  styleUrls: ['./display-title.component.less']
})
export class DisplayTitleComponent implements OnInit {
  @Input() valueLabel: string;
  @Input() valueUnit: string;
  @Input() valueDate: string;

  mainTitle: string;
  subTitle: string;
  date: string;

  constructor() {
    this.mainTitle = '';
    this.subTitle = '';
    this.date = '';
  }

  ngOnInit(): void {
    const titleWords = this.valueLabel.split(' ');
    this.mainTitle = titleWords[0];
    this.subTitle = `${titleWords.slice(1, titleWords.length).join(' ')}`;

    if (this.valueDate !== null) {
      this.date = `*${this.valueDate}`;
    }
  }

}
