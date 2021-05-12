import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from './filters-state.service';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  private baseUrl: string;

  private countrySub: Subscription;
  private retailerSub: Subscription;

  private countryID: number;
  private retailerID: number;


  constructor(
    private http: HttpClient,
    private config: Configuration,
    private filtersStateService: FiltersStateService,
    private appStateService: AppStateService
  ) {
    this.baseUrl = this.config.endpoint;

    const selectedCountry = this.appStateService.selectedCountry;
    const selectedRetailer = this.appStateService.selectedRetailer;

    if (selectedCountry?.id || selectedRetailer?.id) {
      this.countryID = selectedCountry?.id ? selectedCountry.id : undefined;
      this.retailerID = selectedRetailer?.id ? selectedRetailer.id : undefined;
    }

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id !== this.countryID
        ? country?.id
        : undefined;
    });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id !== this.retailerID
        ? retailer?.id
        : undefined;
    });
  }

  concatedQueryParams(): string {
    let startDate = this.filtersStateService.periodQParams.startDate;
    let endDate = this.filtersStateService.periodQParams.endDate;
    let sectors = this.filtersStateService.sectorsQParams;
    let categories = this.filtersStateService.categoriesQParams;
    let campaigns = this.filtersStateService.campaignsQParams;

    return `start_date=${startDate}&end_date=${endDate}&sectors=${sectors}&categories=${categories}${campaigns ? `&campaigns=${campaigns}` : ''}`;
  }

  // *** filters ***
  // solo para este caso es una exepcion y si trabaja con sus query params
  getCampaigns(sectorsStrList?: string, categoriesStrList?: string) {
    if (!this.retailerID) {
      return throwError('[overview.service]: not countryID provided');
    }

    return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/campaigns?sectors=${sectorsStrList}&categories=${categoriesStrList}`);
  }

  // *** kpis ***
  getKpis() {
    if (!this.countryID) {
      return throwError('[overview.service]: not countryID provided');
    }

    let queryParams = this.concatedQueryParams();
    return this.http.get(`${this.baseUrl}/countries/${this.countryID}/kpis?${queryParams}`);
  }

  // *** categories by sector ***
  getCategoriesBySector(sector: string) {
    if (!this.countryID) {
      return throwError('[overview.service]: not countryID provided');
    }
    if (!sector) {
      return throwError('[overview.service]: not sector provided');
    }

    let queryParams = this.concatedQueryParams();
    return this.http.get(`${this.baseUrl}/countries/${this.countryID}/retailer/categories?sector=${sector}&${queryParams}`);
  }

  // *** traffic and sales ***
  getTrafficAndSales(metricType: string, subMetricType: string) {
    if (!this.countryID) {
      return throwError('[overview.service]: not countryID provided');
    }
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }
    if (!subMetricType) {
      return throwError('[overview.service]: not subMetricType provided');
    }

    let queryParams = this.concatedQueryParams();
    return this.http.get(`${this.baseUrl}/countries/${this.countryID}/${metricType}/${subMetricType}?${queryParams}`);
  }

  getUsersAndSales(metricType: string) {
    if (!this.countryID) {
      return throwError('[overview.service]: not countryID provided');
    }

    let queryParams = this.concatedQueryParams();
    return this.http.get(`${this.baseUrl}/countries/${this.countryID}/${metricType}?${queryParams}`);
  }

  getInvestmentVsRevenue() {
    if (!this.countryID) {
      return throwError('[overview.service]: not countryID provided');
    }

    let queryParams = this.concatedQueryParams();
    return this.http.get(`${this.baseUrl}/countries/${this.countryID}/investment-vs-revenue?${queryParams}`);
  }
}
