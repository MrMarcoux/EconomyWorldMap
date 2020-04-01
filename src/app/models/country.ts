export class Country {
    name: string;
    alpha2Code: string;
    alpha3Code: string;
    numericCode: string;
    svgPath: string;

    unemploymentRate: number;
    realInterestRate: number;
    totalReserves: number;
    gdpPerCapita: number;
    lendingInterestRate: number;
    stocksTraded: number;

    unemploymentRateYear: string;
    realInterestRateYear: string;
    totalReservesYear: string;
    gdpPerCapitaYear: string;
    lendingInterestRateYear: string;
    stocksTradedYear: string;

    exports: SITC2ProductGroups;
    imports: SITC2ProductGroups;

    yearlyGdpGrowth: { [year: string]: number; };
    yearlyInflation: { [year: string]: number; };

    tradePartnersExportsProportion: { [alpha3Code: string]: number; };
    tradePartnersImportsProportion: { [alpha3Code: string]: number; };

    tradePartnersLoaded; boolean;
    tradeValuesLoaded: boolean;
    wbDataLoaded: boolean;

    constructor(name: string, alpha2Code: string, alpha3Code: string, numericCode: string, svgPath: string) {
        this.name = name;
        this.alpha2Code = alpha2Code;
        this.alpha3Code = alpha3Code;
        this.numericCode = numericCode;
        this.svgPath = svgPath;

        this.yearlyGdpGrowth = {};
        this.yearlyInflation = {};

        this.unemploymentRate = null;
        this.realInterestRate = null;
        this.totalReserves = null;
        this.gdpPerCapita = null;
        this.lendingInterestRate = null;
        this.stocksTraded = null;

        this.unemploymentRateYear = null;
        this.realInterestRateYear = null;
        this.totalReservesYear = null;
        this.gdpPerCapitaYear = null;
        this.lendingInterestRateYear = null;
        this.stocksTradedYear = null;

        this.tradePartnersExportsProportion = {};
        this.tradePartnersImportsProportion = {};

        this.tradePartnersLoaded = false;
        this.tradeValuesLoaded = false;
        this.wbDataLoaded = false;
    }

    static fromCsvRecord(record: string): Country {
        const alpha2CsvIdx = 0;
        const alpha3CsvIdx = 1;
        const numericCsvIdx = 2;
        const nameCsvIdx = 3;
        const svgPathCsvIdx = 4;

        const attributes = record.split(/","/)
                                 .map(attr => attr.replace('"', ''));

        return new Country (
            attributes[nameCsvIdx],
            attributes[alpha2CsvIdx],
            attributes[alpha3CsvIdx],
            attributes[numericCsvIdx],
            attributes[svgPathCsvIdx]
        );
    }

    totalImports() {
        return Object.values(this.imports).reduce((a, b) => a + b);
    }

    totalExports() {
        return Object.values(this.exports).reduce((a, b) => a + b);
    }

    isLoaded() {
        return this.tradePartnersLoaded &&
        this.tradeValuesLoaded &&
        this.wbDataLoaded;
    }

    gdpYears() {
        return Object.keys(this.yearlyGdpGrowth).map(yearStr => parseInt(yearStr, 10));
    }

    inflationYears() {
        return Object.keys(this.yearlyInflation).map(yearStr => parseInt(yearStr, 10));
    }

    latestYear() {
        const maxGdpYear = Math.max(...this.gdpYears());

        if (Object.keys(this.yearlyInflation).length === 0) {
            return maxGdpYear.toString();
        }

        const maxInflationYear = Math.max(...this.inflationYears());
        return Math.min(...[maxGdpYear, maxInflationYear]).toString();
    }

    currentGdp() {
        return this.yearlyGdpGrowth[this.latestYear()];
    }

    currentIpc() {
        if (this.yearlyInflation === {}) {
            return null;
        }

        return this.yearlyInflation[this.latestYear()];
    }

    parseWITSTradeValueData(witsResponse: string): void {
        this.tradeValuesLoaded = true;

        if (!witsResponse.includes('<')) {
            return;
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(witsResponse, 'text/xml');

        if (xmlDoc.documentElement.nodeName === 'parsererror') {
            return;
        }

        const indicators = Array.from(xmlDoc.getElementsByTagName('Series'));

        this.exports = SITC2ProductGroups.fromXmlArray(indicators.filter(ind => ind.getAttribute('INDICATOR') === 'XPRT-TRD-VL'));
        this.imports = SITC2ProductGroups.fromXmlArray(indicators.filter(ind => ind.getAttribute('INDICATOR') === 'MPRT-TRD-VL'));
    }

    parseWITSPartnerShareData(witsResponse: string): void {

        this.tradePartnersLoaded = true;

        if (!witsResponse.includes('<')) {
            return;
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(witsResponse, 'text/xml');

        if (xmlDoc.documentElement.nodeName === 'parsererror') {
            return;
        }

        const indicators = Array.from(xmlDoc.getElementsByTagName('Series'));

        indicators.filter(ind => ind.getAttribute('INDICATOR') === 'XPRT-PRTNR-SHR' ).forEach(series => {
            const alphaCode = series.getAttribute('PARTNER');
            const shareStr = series.firstElementChild.getAttribute('OBS_VALUE');
            this.tradePartnersExportsProportion[alphaCode] = parseFloat(shareStr);
        });

        indicators.filter(ind => ind.getAttribute('INDICATOR') === 'MPRT-PRTNR-SHR' ).forEach(series => {
            const alphaCode = series.getAttribute('PARTNER');
            const shareStr = series.firstElementChild.getAttribute('OBS_VALUE');
            this.tradePartnersImportsProportion[alphaCode] = parseFloat(shareStr);
        });
    }

    parseWBdata(wbResponse: any): void {
        const indicators = wbResponse[1];

        this.wbDataLoaded = true;

        if (indicators === null || indicators === undefined) {
            return;
        }

        indicators.filter(ind => ind.indicator.id === 'NY.GDP.MKTP.KD.ZG').forEach(ind => {
            if (ind.value !== null) {
                this.yearlyGdpGrowth[ind.date] = ind.value;
            }
        });

        if (Object.keys(this.yearlyGdpGrowth).length === 0) {
            return;
        }

        indicators.filter(ind => ind.indicator.id === 'FP.CPI.TOTL.ZG').forEach(ind => {
            if (ind.value !== null) {
                this.yearlyInflation[ind.date] = ind.value;
            }
        });

        const unemploymentRate = this.getLatestYearIndicator('SL.UEM.TOTL.ZS', indicators);
        this.unemploymentRate = unemploymentRate.value;
        this.unemploymentRateYear = unemploymentRate.year;

        const gdpPerCapita = this.getLatestYearIndicator('NY.GDP.PCAP.CD', indicators);
        this.gdpPerCapita = gdpPerCapita.value;
        this.gdpPerCapitaYear = gdpPerCapita.year;

        const lendingInterestRate = this.getLatestYearIndicator('FR.INR.LEND', indicators);
        this.lendingInterestRate = lendingInterestRate.value;
        this.lendingInterestRateYear = lendingInterestRate.year;

        const stocksTraded = this.getLatestYearIndicator('CM.MKT.TRAD.GD.ZS', indicators);
        this.stocksTraded = stocksTraded.value;
        this.stocksTradedYear = stocksTraded.year;

        const realInterestRate = this.getLatestYearIndicator('FR.INR.RINR', indicators);
        this.realInterestRate = realInterestRate.value;
        this.realInterestRateYear = realInterestRate.year;

        const totalReserves = this.getLatestYearIndicator('FI.RES.TOTL.CD', indicators);
        this.totalReserves = totalReserves.value;
        this.totalReservesYear = totalReserves.year;
    }

    getLatestYearIndicator(id: string, indicators) {

        const years = indicators.filter(ind => ind.value !== null)
                                .filter((ind: { indicator: { id: string; }; }) => ind.indicator.id === id)
                                .map((ind: { date: string; }) => parseInt(ind.date, 10));

        if (years.length === 0) {
            return {
                value: null,
                year: null
            };
        }

        const latestYear = Math.max(...years).toString();

        return {
                    value: indicators.filter((ind: { indicator: { id: string; }; }) => ind.indicator.id === id)
                         .find((ind: { date: string; }) => ind.date === latestYear)
                         .value,
                    year: latestYear
                };
    }
}

export class SITC2ProductGroups {
    agricultureRawMaterials: number;
    chemicals: number;
    food: number;
    fuels: number;
    manufactures: number;
    oresAndMetals: number;
    textiles: number;
    machineryAndTransport: number;

    constructor(agricultureRawMaterials: number,
                chemicals: number,
                food: number,
                fuels: number,
                manufactures: number,
                oresAndMetals: number,
                textiles: number,
                machineryAndTransport: number) {
        this.agricultureRawMaterials = agricultureRawMaterials;
        this.chemicals = chemicals;
        this.food = food;
        this.fuels = fuels;
        this.manufactures = manufactures;
        this.oresAndMetals = oresAndMetals;
        this.textiles = textiles;
        this.machineryAndTransport = machineryAndTransport;
    }

    static fromXmlArray(xmlArray: any[]) {
        return new SITC2ProductGroups(
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'AgrRaw'),
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'Chemicals'),
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'Food'),
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'Fuels'),
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'manuf'),
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'OresMtls'),
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'Textiles'),
            SITC2ProductGroups.valueFromProductCodeXml(xmlArray, 'Transp')
        );

    }

    static valueFromProductCodeXml(xmlArray: any[], productCode: string) {
        if (!xmlArray.some(ind => ind.getAttribute('PRODUCTCODE') === productCode)) {
            return 0;
        }

        return parseInt(xmlArray
        .find(ind => ind.getAttribute('PRODUCTCODE') === productCode)
        .firstElementChild
        .getAttribute('OBS_VALUE'), 10);
    }
}

export function csvToCountries(data: string): Country[] {
    return data.split(/\r\n|\n/)
               .filter(line => line)
               .filter(line => line.length > 0)
               .map(row => Country.fromCsvRecord(row));
}
