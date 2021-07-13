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


  /**
   * Concated query params
   * @param [isLatam] to add reatilers and sources query params
   * @param [uniqueSectorID] to use only one sectorID instead of all selected sectors in filters in query params
   * @param [uniqueCategoryID] to use only one categoryID instead of all selected categories in filters in query params
   * @param [uniqueSourceID] to use only one sourceID instead of all selected sources in filters in query params
   * @param [omitSectors] to omit use sectors query params
   * @returns query params 
   */
  concatedQueryParams(isLatam?: boolean, uniqueSectorID?: number, uniqueCategoryID?: number, uniqueSourceID?: number, omitSectors?: boolean): string {
    let startDate = this.filtersStateService.periodQParams.startDate;
    let endDate = this.filtersStateService.periodQParams.endDate;
    let sectors = !uniqueSectorID ? this.filtersStateService.sectorsQParams : uniqueSectorID;
    let categories = !uniqueCategoryID ? this.filtersStateService.categoriesQParams : uniqueCategoryID;
    let sources = !uniqueSourceID ? this.filtersStateService.sourcesQParams : uniqueSourceID;
    let campaigns = this.filtersStateService.campaignsQParams;

    const baseQParams = `start_date=${startDate}&end_date=${endDate}${!omitSectors ? `&sectors=${sectors}` : ''}&categories=${categories}`;
    if (this.retailerID) {
      return `${baseQParams}${campaigns ? `&campaigns=${campaigns}` : ''}`;

    } else if (this.countryID) {
      return `${baseQParams}&sources=${sources}`;

    } else {
      let retailers = this.filtersStateService.retailersQParams;
      return `retailers=${retailers}&${baseQParams}&sources=${sources}`;
    }
  }


  /**
   * Customs query params
   * @param [isLatam] to add reatilers and sources query params
   * @param [sectorsQP] sectors query params
   * @param [categoriesQP] categories query params
   * @param [sourcesQP] sources query params
   * @returns query params
   */

  // This method not use sectors, categories and sources selected in general filters
  // So the selection and query params are generated independently
  customQueryParams(isLatam?: boolean, sectorsQP?: string, categoriesQP?: string, sourcesQP?: string) {
    let startDate = this.filtersStateService.periodQParams.startDate;
    let endDate = this.filtersStateService.periodQParams.endDate;
    let campaigns = this.filtersStateService.campaignsQParams;
    let sectors = !sectorsQP ? this.filtersStateService.sectorsQParams : sectorsQP;
    let categories = !categoriesQP ? this.filtersStateService.categoriesQParams : categoriesQP;
    let sources = !sourcesQP ? this.filtersStateService.sourcesQParams : sourcesQP;

    const baseQParams = `start_date=${startDate}&end_date=${endDate}&sectors=${sectors}&categories=${categories}`;
    if (!isLatam) {
      return `${baseQParams}&sources=${sources}${campaigns ? `&campaigns=${campaigns}` : ''}`;

    } else {
      let retailers = this.filtersStateService.retailersQParams;
      return `retailers=${retailers}&${baseQParams}&sources=${sources}`;
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

  // *** traffic or sales + submetric ***
  getTrafficOrSales(metricType: string, subMetricType: string) {
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

  // *** users vs conversions / investment vs revenue / revenue vs aup ***
  getUsersInvOrAup(metricType: string, sectors?: number[], categories?: number[], sources?: number[]) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }

    const sectorsQParams = sectors && this.filtersStateService.convertArrayToQueryParams(sectors);
    const categoriesQParams = categories && this.filtersStateService.convertArrayToQueryParams(categories);
    const sourcesQParams = sources && this.filtersStateService.convertArrayToQueryParams(sources);

    let queryParams = this.customQueryParams(false, sectorsQParams, categoriesQParams, sourcesQParams);

    if (this.retailerID) {
      return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/${metricType}?${queryParams}`);
    } else if (this.countryID) {
      return this.http.get(`${this.baseUrl}/countries/${this.countryID}/${metricType}?${queryParams}`);
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

  // *** traffic or sales + submetric ***
  getTrafficOrSalesLatam(metricType: string, subMetricType: string) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }
    if (!subMetricType) {
      return throwError('[overview.service]: not subMetricType provided');
    }

    let queryParams = this.concatedQueryParams(true);
    return this.http.get(`${this.baseUrl}/latam/${metricType}/${subMetricType}?${queryParams}`);
  }

  // *** users vs conversions / investment vs revenue / revenue vs aup ***
  getUsersInvOrAupLatam(metricType: string, sectors?: number[], categories?: number[], sources?: number[]) {
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }

    const sectorsQParams = sectors && this.filtersStateService.convertArrayToQueryParams(sectors);
    const categoriesQParams = categories && this.filtersStateService.convertArrayToQueryParams(categories);
    const sourcesQParams = sources && this.filtersStateService.convertArrayToQueryParams(sources);

    let queryParams = this.customQueryParams(true, sectorsQParams, categoriesQParams, sourcesQParams);

    return this.http.get(`${this.baseUrl}/latam/${metricType}?${queryParams}`);
  }

  // *** top products ***
  getTopProductsLatam(categoryID: number) {
    let queryParams = this.concatedQueryParams(true, null, categoryID);
    return this.http.get(`${this.baseUrl}/latam/top-products?${queryParams}`);
  }
}
