import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Country, csvToCountries } from 'src/app/models/country';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import * as Parallel from 'async-parallel';

@Injectable({
  providedIn: 'root'
})
export class CountryinfoService {
  readonly witsBaseUrl = 'http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/';
  readonly wbBaseUrl = '';
  readonly countryListAssetPath = 'assets/csv/country-list.csv';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    const csvCall = this.http.get(this.countryListAssetPath, {responseType: 'text'});

    return csvCall.pipe(
      map(csvResponse => csvToCountries(csvResponse)),
      switchMap(countries => {
        Parallel.each(countries, async country => {

          const baseYear = 1985;
          const currentYear = (new Date()).getFullYear();

          const witsTradeValueApiCall = this.http.get(`http://localhost:80/witsproxy/reporter/${country.alpha3Code.toLowerCase()}` +
          `/year/${currentYear - 2}/partner/WLD/product/all/indicator/XPRT-TRD-VL;MPRT-TRD-VL`,
          { responseType: 'text' });

          const witsPartnerShareApiCall = this.http.get(`http://localhost:80/witsproxy/reporter/${country.alpha3Code.toLowerCase()}` +
          `/year/${currentYear - 2}/partner/all/product/all/indicator/MPRT-PRTNR-SHR;XPRT-PRTNR-SHR;`,
          { responseType: 'text' });

          const wbApiCall = this.http.get(`http://api.worldbank.org/v2/country/${country.alpha3Code.toLowerCase()}/indicator` +
                                          `/CM.MKT.TRAD.GD.ZS;FR.INR.LEND;NY.GDP.MKTP.KD.ZG;NY.GDP.PCAP.CD;` +
                                          `SL.UEM.TOTL.ZS;FI.RES.TOTL.CD;FP.CPI.TOTL.ZG;FR.INR.RINR` +
                                          `?source=2&per_page=${(currentYear - baseYear) * 8}&date=${baseYear}:${currentYear}&format=JSON`);

          forkJoin([witsTradeValueApiCall, witsPartnerShareApiCall, wbApiCall]).subscribe(results => {
            country.parseWITSTradeValueData(results[0]);
            country.parseWITSPartnerShareData(results[1]);
            country.parseWBdata(results[2]);
          });
        });

        return of(countries);
    }));
  }
}


