import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/country';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit  {

  constructor() {
    this.focusedCountry = null;
  }
  focusedCountry: Country;

  ngOnInit(): void {

  }

  countrySelected(country: Country) {
    this.focusedCountry = country;
  }

  countryUnselected(event: any) {
    this.focusedCountry = null;
  }

}
