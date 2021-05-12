import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FiltersStateService {

  // selected period
  private periodSource = new Subject<Period>();
  period$ = this.periodSource.asObservable();
  period: Period;
  periodQParams;

  // selected sectors
  private sectorsSource = new Subject<any[]>();
  sectors$ = this.sectorsSource.asObservable();
  sectors: any[];
  sectorsQParams;

  // selected categories
  private categoriesSource = new Subject<any[]>();
  categories$ = this.categoriesSource.asObservable();
  categories: any[];
  categoriesQParams;

  // selected campaigns
  private cammpaignsSource = new Subject<any[]>();
  campaigns$ = this.cammpaignsSource.asObservable();
  campaigns: any[];
  campaignsQParams;


  constructor() { }

  selectPeriod(period: Period) {
    this.periodSource.next(period);
    this.period = period;
    console.log('new Period', period)
  }

  selectSectors(sectors: any[]) {
    this.sectorsSource.next(sectors);
    this.sectors = sectors;
    console.log('new sectors', sectors)
  }

  selectCategories(categories: any[]) {
    this.categoriesSource.next(categories);
    this.categories = categories;
    console.log('new categories', categories)
  }

  selectCampaigns(campaigns: any[]) {
    this.cammpaignsSource.next(campaigns);
    this.campaigns = campaigns;
    console.log('new campaigns', campaigns)
  }

  convertFiltersToQueryParams() {
    this.periodQParams = { startDate: moment(this.period.startDate).format('YYYY-MM-DD'), endDate: moment(this.period.endDate).format('YYYY-MM-DD') }
    this.sectorsQParams = this.sectors && this.convertArrayToQueryParams(this.sectors, 'id');
    this.categoriesQParams = this.categories && this.convertArrayToQueryParams(this.categories, 'id');
    this.campaignsQParams = this.campaigns && this.convertArrayToQueryParams(this.campaigns, 'id');

    console.log('periodParams', this.periodQParams)
    console.log('sectorsQParams', this.sectorsQParams)
    console.log('categoriesQParams', this.categoriesQParams)
    console.log('campaignsQParams', this.campaignsQParams)
  }

  // boton de filtrar
  convertArrayToQueryParams(array, param: string): string {
    let stringArray = '';
    for (let i = 0; i < array.length; i++) {
      stringArray = stringArray.concat(',', array[i][param]);
    }

    return stringArray.substring(1);
  }
}

interface Period {
  startDate: Date,
  endDate: Date
}

