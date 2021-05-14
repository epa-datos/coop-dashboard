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

  // filtersChange
  private filtersSource = new Subject<any>();
  filtersChange$ = this.filtersSource.asObservable();

  constructor() { }

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

  convertFiltersToQueryParams() {
    this.periodQParams = { startDate: moment(this.period.startDate).format('YYYY-MM-DD'), endDate: moment(this.period.endDate).format('YYYY-MM-DD') }
    this.sectorsQParams = this.sectors && this.convertArrayToQueryParams(this.sectors, 'id');
    this.categoriesQParams = this.categories && this.convertArrayToQueryParams(this.categories, 'id');
    this.campaignsQParams = this.campaigns && this.convertArrayToQueryParams(this.campaigns, 'id');
  }

  convertArrayToQueryParams(array, param: string): string {
    let stringArray = '';
    for (let i = 0; i < array.length; i++) {
      stringArray = stringArray.concat(',', array[i][param]);
    }

    return stringArray.substring(1);
  }

  clearCampaignsSelection() {
    this.selectCampaigns([]);
    delete this.campaignsQParams;
  }

  filtersChange() {
    this.convertFiltersToQueryParams();
    this.filtersSource.next();
  }
}

interface Period {
  startDate: Date,
  endDate: Date
}

