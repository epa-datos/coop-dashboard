import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from './filters-state.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignInRetailService {
  private baseUrl: string;

  private retailerID: number;

  constructor(
    private http: HttpClient,
    private config: Configuration,
    private filtersStateService: FiltersStateService,
    private appStateService: AppStateService) {
    this.baseUrl = this.config.endpoint;

    const selectedRetailer = this.appStateService.selectedRetailer;
    this.retailerID = selectedRetailer?.id ? selectedRetailer.id : undefined;

    this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;
    });
  }

  concatedQueryParams(): string {
    let startDate = this.filtersStateService.periodQParams.startDate;
    let endDate = this.filtersStateService.periodQParams.endDate;
    let sectors = this.filtersStateService.sectorsQParams;
    let categories = this.filtersStateService.categoriesQParams;
    let campaigns = this.filtersStateService.campaignsQParams;

    const baseQParams = `start_date=${startDate}&end_date=${endDate}&sectors=${sectors}&categories=${categories}`;
    return `${baseQParams}${campaigns ? `&campaigns=${campaigns}` : ''}`;
  }

  concatedRetailerQueryParams() {
    let sources = this.filtersStateService.retailSourcesQParams;
    let mediums = this.filtersStateService.retailMediumsQParams;
    let audiences = this.filtersStateService.retailAudiencesQParams;

    let sourceQParam = `${sources ? `sources=${sources}` : ''}`;
    let mediumQParam = `${mediums ? `mediums=${mediums}` : ''}`;
    let baseQParams = `${sourceQParam ? `${sourceQParam}&` : ''}` + `${mediumQParam ? `${mediumQParam}&` : ''}`
    return `${baseQParams}${audiences ? `audiences=${audiences}` : ''}`;

  }

  getKpis() {
    if (!this.retailerID) {
      return throwError('[campaign-in-retail.service]: not retailerID provided');
    }

    let queryParams = this.concatedQueryParams();
    let queryParamsR = this.concatedRetailerQueryParams();

    return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/in-retail/kpis?${queryParams}&${queryParamsR}`);
  }

  getRoasBySector() {
    if (!this.retailerID) {
      return throwError('[campaign-in-retail.service]: not retailerID provided');
    }

    let queryParams = this.concatedQueryParams();
    let queryParamsR = this.concatedRetailerQueryParams();

    return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/in-retail/roas?${queryParams}&${queryParamsR}`);
  }


  /**
   *  GENERIC ENDPOINT
   * For endponts with a metric and optional submetric
   * @param metricType 
   * @param [subMetricType] 
   * @returns  
   */
  getDataByMetric(metricType: string, subMetricType?: string) {
    if (!this.retailerID) {
      return throwError('[campaign-in-retail.service]: not retailerID provided');
    }

    let queryParams = this.concatedQueryParams();
    let queryParamsR = this.concatedRetailerQueryParams();

    return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/in-retail/${metricType}${subMetricType ? `/${subMetricType}` : ''}?${queryParams}&${queryParamsR}`);
  }
}
