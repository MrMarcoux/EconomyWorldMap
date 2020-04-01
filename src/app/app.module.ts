import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapComponent } from './components/map/map.component';
import { ValueDisplayComponent } from './components/value-display/value-display.component';
import { ProgressDisplayComponent } from './components/progress-display/progress-display.component';
import { SITC2ProductsDisplayComponent } from './components/sitc2-products-display/sitc2-products-display.component';
import { DisplayTitleComponent } from './components/display-title/display-title.component';
import { CountryNameDisplayComponent } from './components/country-name-display/country-name-display.component';
import { ChartsModule } from 'ng2-charts';
import { SingleBarProportionComponent } from './components/single-bar-proportion/single-bar-proportion.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MapComponent,
    ValueDisplayComponent,
    ProgressDisplayComponent,
    SITC2ProductsDisplayComponent,
    DisplayTitleComponent,
    CountryNameDisplayComponent,
    SingleBarProportionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
