import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from './filters-state.service';
import * as moment from 'moment';

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
      this.countryID = country?.id;
    });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;
    });
  }

  concatedQueryParams(isLatam?: boolean, uniqueSectorID?: number, uniqueCategoryID?: number, uniqueSourceID?: number, omitSectors?: boolean): string {
    let startDate = this.filtersStateService.periodQParams.startDate;
    let endDate = this.filtersStateService.periodQParams.endDate;
    let sectors = !uniqueSectorID ? this.filtersStateService.sectorsQParams : uniqueSectorID;
    let categories = !uniqueCategoryID ? this.filtersStateService.categoriesQParams : uniqueCategoryID;
    let campaigns = this.filtersStateService.campaignsQParams;

    const baseQParams = `start_date=${startDate}&end_date=${endDate}${!omitSectors ? `&sectors=${sectors}` : ''}&categories=${categories}`;
    if (!isLatam) {
      return `${baseQParams}${campaigns ? `&campaigns=${campaigns}` : ''}`;
    } else {
      let countries = this.filtersStateService.countriesQParams;
      let retailers = this.filtersStateService.retailersQParams;
      let sources = !uniqueSourceID ? this.filtersStateService.sourcesQParams : uniqueSourceID;
      return `countries=${countries}&retailers=${retailers}&sources=${sources}&${baseQParams}`;
    }
  }

  /**** COUNTRIES AND RETAILERS
  * Overview endpoints for Countries and Retailers
  * ****/

  // *** filters ***
  getCampaigns(period?: any, sectorsStrList?: string, categoriesStrList?: string) {
    if (!this.retailerID) {
      return throwError('[overview.service]: not countryID provided');
    }

    const periodQParams = period ? `start_date=${moment(period.startDate).format('YYYY-MM-DD')}&end_date=${moment(period.endDate).format('YYYY-MM-DD')}` : '';
    const sectorsQParams = sectorsStrList ? `sectors=${sectorsStrList}` : '';
    const categoriesQParams = categoriesStrList ? `categories=${categoriesStrList}` : '';

    return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/campaigns?${periodQParams}&${sectorsQParams}&${categoriesQParams}`);
  }

  // *** kpis ***
  getKpis() {
    let queryParams = this.concatedQueryParams();

    if (this.retailerID) {
      return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/kpis?${queryParams}`);
    } else if (this.countryID) {
      return this.http.get(`${this.baseUrl}/countries/${this.countryID}/kpis?${queryParams}`);
    } else {
      return throwError('[overview.service]: not retailerID or countryID provided');
    }
  }

  // *** categories by sector ***
  getCategoriesBySector(sector?: string) {
    if (this.retailerID) {
      let queryParams = this.concatedQueryParams();
      return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/categories?${queryParams}`);
    } else if (this.countryID) {
      let queryParams = this.concatedQueryParams(null, null, null, null, true);
      return this.http.get(`${this.baseUrl}/countries/${this.countryID}/retailer/categories?sector=${sector}&${queryParams}`);
    } else {
      return throwError('[overview.service]: not retailerID or countryID provided');
    }
  }

  // *** traffic and sales ***
  getTrafficAndSales(metricType: string, subMetricType: string) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }
    if (!subMetricType) {
      return throwError('[overview.service]: not subMetricType provided');
    }

    let queryParams = this.concatedQueryParams();

    if (this.retailerID) {
      return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/${metricType}/${subMetricType}?${queryParams}`);
    } else if (this.countryID) {
      return this.http.get(`${this.baseUrl}/countries/${this.countryID}/${metricType}/${subMetricType}?${queryParams}`);
    } else {
      return throwError('[overview.service]: not retailerID or countryID provided');
    }
  }

  // *** users and sales ***
  getUsersAndSales(metricType: string) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }

    let queryParams = this.concatedQueryParams();

    if (this.retailerID) {
      return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/${metricType}?${queryParams}`);
    } else if (this.countryID) {
      return this.http.get(`${this.baseUrl}/countries/${this.countryID}/${metricType}?${queryParams}`);
    } else {
      return throwError('[overview.service]: not retailerID or countryID provided');
    }
  }

  // *** investment vs revenue ***
  getInvestmentVsRevenue() {
    let queryParams = this.concatedQueryParams();

    if (this.retailerID) {
      return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/investment-vs-revenue?${queryParams}`);
    } else if (this.countryID) {
      return this.http.get(`${this.baseUrl}/countries/${this.countryID}/investment-vs-revenue?${queryParams}`);
    } else {
      return throwError('[overview.service]: not retailerID or countryID provided');
    }
  }


  /**** LATAM
  * Overview endpoints for LATAM
  * ****/

  // *** kpis ***
  getKpisLatam() {
    let queryParams = this.concatedQueryParams(true);
    return this.http.get(`${this.baseUrl}/latam/kpis?${queryParams}`);
  }

  // *** sectors by country ***
  getSectorsAndCategoriesLatam(metricType: string) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }

    let queryParams = this.concatedQueryParams(true);
    return this.http.get(`${this.baseUrl}/latam/countries/${metricType}/segments?${queryParams}`);
  }

  // *** traffic and sales ***
  getTrafficAndSalesLatam(metricType: string, subMetricType: string) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }
    if (!subMetricType) {
      return throwError('[overview.service]: not subMetricType provided');
    }

    let queryParams = this.concatedQueryParams(true);
    return this.http.get(`${this.baseUrl}/latam/${metricType}/${subMetricType}?${queryParams}`);
  }

  // *** users and sales ***
  getUsersAndSalesLatam(metricType: string, sectorID?: number, categoryID?: number, sourceID?: number) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }

    let queryParams = this.concatedQueryParams(true, sectorID, categoryID, sourceID);
    return this.http.get(`${this.baseUrl}/latam/${metricType}?${queryParams}`);
  }

  // *** investment vs revenue ***
  getInvestmentVsRevenueLatam() {
    let queryParams = this.concatedQueryParams(true);
    return this.http.get(`${this.baseUrl}/latam/investment-vs-revenue?${queryParams}`);
  }

  // *** top products ***
  getTopProductsLatam(categoryID: number) {
    let queryParams = this.concatedQueryParams(true, null, categoryID);
    return this.http.get(`${this.baseUrl}/latam/top-products?${queryParams}`);
  }
}
