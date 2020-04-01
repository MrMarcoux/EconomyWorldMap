import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-country-name-display',
  templateUrl: './country-name-display.component.html',
  styleUrls: ['./country-name-display.component.less']
})
export class CountryNameDisplayComponent implements OnInit {
  @Input() alphaCode: string;
  @Input() name: string;
  @Output() countryUnselected: EventEmitter<void>;

  constructor() {
    this.countryUnselected =  new EventEmitter();
   }

  ngOnInit(): void {
  }

  onQuit(event) {
    this.countryUnselected.emit();
  }

}
