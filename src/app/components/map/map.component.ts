import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as _ from 'lodash';
import { Country } from 'src/app/models/country';
import { CountryinfoService } from 'src/app/services/countryinfo.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {

  @Output() countrySelected: EventEmitter<Country>;
  @Input() selectedCountry: Country;

  readonly maxXToWidthRatio = 0.5;
  readonly minXToWidthRatio = -0.2;
  readonly maxYToWidthRatio = 0.2;
  readonly minYToWidthRatio = -0.2;

  maxXAxis: number;
  minXAxis: number;
  maxYAxis: number;
  minYAxis: number;

  isCursorDown: boolean;
  cursorOrigin: any;
  viewBox: any;
  newCursorCoordinates: any;
  viewBoxString: string;
  mapWidth: number;

  countries: Country[];

  constructor(private countryInfoService: CountryinfoService) {
    this.viewBoxString = '215 60 2000 1700';
    this.isCursorDown = false;

    this.cursorOrigin = {
      x: 215,
      y: 60
    };

    this.viewBox = {
      x: 215,
      y: 60,
      width: 2000,
      height: 1700
    };

    this.newCursorCoordinates = {
      x: 0,
      y: 0
    };

    this.setWidth(1500);

    this.countrySelected =  new EventEmitter();
  }

  static getPointFromCursorEvent(event) {
    const point = {x: 0, y: 0};
    if (event.targetTouches) {
      point.x = event.targetTouches[0].clientX;
      point.y = event.targetTouches[0].clientY;
    } else {
      point.x = event.clientX;
      point.y = event.clientY;
    }

    return point;
  }

  ngOnInit(): void {
    this.countryInfoService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  setWidth(width: number) {
    this.maxXAxis = this.maxXToWidthRatio * width;
    this.minXAxis = this.minXToWidthRatio * width;
    this.maxYAxis = this.maxYToWidthRatio * width;
    this.minYAxis = this.minYToWidthRatio * width;
    this.mapWidth = width;
  }

  onMouseLeave(event) {
    this.isCursorDown = false;
    this.viewBox.x = this.newCursorCoordinates.x;
    this.viewBox.y = this.newCursorCoordinates.y;
  }

  onMouseUp(event) {
    this.isCursorDown = false;
    this.viewBox.x = this.newCursorCoordinates.x;
    this.viewBox.y = this.newCursorCoordinates.y;

  }

  onMouseDown(event) {
    this.isCursorDown = true;
    this.cursorOrigin = MapComponent.getPointFromCursorEvent(event);
  }

  onMouseMove(event) {
    if (!this.isCursorDown) {
      return;
    }

    event.preventDefault();

    const cursorPosition = MapComponent.getPointFromCursorEvent(event);

    this.newCursorCoordinates.x = _.clamp(this.viewBox.x - (cursorPosition.x - this.cursorOrigin.x), this.minXAxis, this.maxXAxis);

    this.newCursorCoordinates.y = _.clamp(this.viewBox.y - (cursorPosition.y - this.cursorOrigin.y), this.minYAxis, this.maxYAxis);

    this.viewBoxString = `${this.newCursorCoordinates.x} ${this.newCursorCoordinates.y} ${this.viewBox.width} ${this.viewBox.height}`;
  }

  isCountrySelected(alphaCode: string) {
    if (this.selectedCountry === null) {
      return false;
    }

    return alphaCode === this.selectedCountry.alpha3Code;
  }

  onCountryClick(event: any) {
    const alpha3Code = event.explicitOriginalTarget.dataset.id;

    const selectedCountry = this.countries.find(country => country.alpha3Code === alpha3Code);

    this.countrySelected.emit(selectedCountry);
  }
}
