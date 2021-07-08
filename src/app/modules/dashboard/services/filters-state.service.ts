import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FiltersStateService {

  /**** GENERAL FILTERS
  * Filters used in dashboard component
  * ****/

  // selected countries
  private countriesSource = new Subject<any[]>();
  countries$ = this.countriesSource.asObservable();
  countries: any[];
  countriesInitial: any[];
  countriesQParams;

  // selected retailers
  private retailersSource = new Subject<any[]>();
  retailers$ = this.retailersSource.asObservable();
  retailers: any[];
  retailersInitial: any[];
  retailersQParams;

  // selected period
  private periodSource = new Subject<Period>();
  period$ = this.periodSource.asObservable();
  period: Period;
  periodInitial: Period;
  periodQParams;

  // selected sectors
  private sectorsSource = new Subject<any[]>();
  sectors$ = this.sectorsSource.asObservable();
  sectors: any[];
  sectorsInitial: any[];
  sectorsQParams;

  // selected categories
  private categoriesSource = new Subject<any[]>();
  categories$ = this.categoriesSource.asObservable();
  private hideCategoriesSource = new Subject<boolean>(); // only used in other-tools component
  hideCategories$ = this.hideCategoriesSource.asObservable();
  categories: any[];
  categoriesInitial: any[];
  categoriesQParams;

  // selected campaigns
  private cammpaignsSource = new Subject<any[]>();
  campaigns$ = this.cammpaignsSource.asObservable();
  campaigns: any[];
  campaignsInitial: any[];
  campaignsQParams;

  // selected sources
  private sourcesSource = new Subject<any[]>();
  sources$ = this.sourcesSource.asObservable();
  sources: any[];
  sourcesInitial: any[];
  sourcesQParams;

  // filtersChange
  private filtersSource = new Subject<boolean>();
  filtersChange$ = this.filtersSource.asObservable();


  /**** RETAIL FILTERS
  * Filters used in retailer component
  * ****/

  // source
  private retailSourcesSource = new Subject<any[]>();
  retailSources$ = this.retailSourcesSource.asObservable();
  retailSources: any[];
  retailSourcesQParams;

  // medium
  private retailMediumsSource = new Subject<any[]>();
  retailMediums$ = this.retailMediumsSource.asObservable();
  retailMediums: any[];
  retailMediumsQParams;

  // audiences
  private retailAudiencesSource = new Subject<any[]>();
  retailAudiences$ = this.retailAudiencesSource.asObservable();
  retailAudiences: any[];
  retailAudiencesQParams;

  // filtersChange
  private retailFiltersSource = new Subject<boolean>();
  retailFiltersChange$ = this.retailFiltersSource.asObservable();

  constructor() { }

  selectCountries(countries: any[]) {
    this.countriesSource.next(countries);
    this.countries = countries;
  }

  selectRetailers(retailers: any[]) {
    this.retailersSource.next(retailers);
    this.retailers = retailers;
  }

  selectPeriod(period: Period) {
    this.periodSource.next(period);
    this.period = period;
  }

  selectSectors(sectors: any[]) {
    this.sectorsSource.next(sectors);
    this.sectors = sectors;
  }

  selectCategories(categories: any[]) {
    this.categoriesSource.next(categories);
    this.categories = categories;
  }

  selectCampaigns(campaigns: any[]) {
    this.cammpaignsSource.next(campaigns);
    this.campaigns = campaigns;
  }

  selectSources(sources: any[]) {
    this.sourcesSource.next(sources);
    this.sources = sources;
  }

  selectRetailSources(sources: any[]) {
    this.retailSourcesSource.next(sources);
    this.retailSources = sources;
  }

  selectRetailMediums(mediums: any[]) {
    this.retailMediumsSource.next(mediums);
    this.retailMediums = mediums;
  }

  selectRetailAudiences(audiences: any[]) {
    this.retailAudiencesSource.next(audiences);
    this.retailAudiences = audiences;
  }

  hideCategories(value) {
    this.hideCategoriesSource.next(value);
  }

  convertFiltersToQueryParams() {
    this.periodQParams = { startDate: moment(this.period.startDate).format('YYYY-MM-DD'), endDate: moment(this.period.endDate).format('YYYY-MM-DD') };
    this.sectorsQParams = this.sectors && this.convertArrayToQueryParams(this.sectors, 'id');
    this.categoriesQParams = this.categories && this.convertArrayToQueryParams(this.categories, 'id');
    this.countriesQParams = this.countries && this.convertArrayToQueryParams(this.countries, 'id');
    this.retailersQParams = this.retailers && this.convertArrayToQueryParams(this.retailers, 'id');
    this.sourcesQParams = this.sources && this.convertArrayToQueryParams(this.sources, 'id');
    this.campaignsQParams = this.campaigns && this.convertArrayToQueryParams(this.campaigns, 'id');
  }

  convertRetailFiltersToQueryParams() {
    this.retailSourcesQParams = this.retailSources && this.convertArrayToQueryParams(this.retailSources, 'id');
    this.retailMediumsQParams = this.retailMediums && this.convertArrayToQueryParams(this.retailMediums, 'id');
    this.retailAudiencesQParams = this.retailAudiences && this.convertArrayToQueryParams(this.retailAudiences, 'id');
  }

  convertArrayToQueryParams(array, param?: string): string {
    let stringArray = '';
    for (let i = 0; i < array.length; i++) {

      if (param) {
        stringArray = array[i][param] ? stringArray.concat(',', array[i][param]) : stringArray;
      } else {
        stringArray = array[i] ? stringArray.concat(',', array[i]) : stringArray;
      }
    }

    return stringArray.substring(1);
  }

  restoreFilters() {
    this.countries = this.countriesInitial;
    this.retailers = this.retailersInitial;
    this.period = this.periodInitial;
    this.sectors = this.sectorsInitial;
    this.sources = this.sourcesInitial;
    this.categories = this.categoriesInitial;
    this.selectCampaigns([]);
    this.convertFiltersToQueryParams();
  }

  deleteFilters() {
    if (this.countriesInitial) {
      delete this.countriesInitial;
      delete this.countries;
    }

    if (this.retailersInitial) {
      delete this.retailersInitial;
      delete this.retailers;
    }

    if (this.periodInitial) {
      delete this.periodInitial;
      delete this.period;
    }

    if (this.sectorsInitial) {
      delete this.sectorsInitial;
      delete this.sectors;
    }

    if (this.sourcesInitial) {
      delete this.sourcesInitial;
      delete this.sources;
    }

    if (this.categoriesInitial) {
      delete this.categoriesInitial;
      delete this.categories;
    }
    this.selectCampaigns([]);
  }

  /**
   * Filters change
   * @param manualChange change made by "filter" button click triggered manually by the user
   */
  filtersChange(manualChange: boolean) {
    this.convertFiltersToQueryParams();
    this.filtersSource.next(manualChange);
  }

  retailFiltersChange() {
    this.convertRetailFiltersToQueryParams();
    this.retailFiltersSource.next();
  }
}

interface Period {
  startDate: Date,
  endDate: Date
}
