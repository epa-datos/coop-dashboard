import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { FiltersStateService } from './filters-state.service';
import * as moment from 'moment';
import { AUDIENCES, MEDIUMS, SOURCES } from 'src/app/tools/constants/filters';

@Injectable({
  providedIn: 'root'
})
export class CampaignComparatorService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: Configuration,
    private filtersStateService: FiltersStateService
  ) {
    this.baseUrl = this.config.endpoint;
  }

  /**
 * Concated query params
 * @returns query params 
 */
  concatedQueryParams(campaignID?: number): string {
    const daysAgo = 90;
    const startDate = moment().subtract(daysAgo, 'd').format('YYYY-MM-DD');
    const endDate = moment().subtract(1, 'd').format('YYYY-MM-DD');

    const sectors = this.filtersStateService.sectorsQParams;
    const categories = this.filtersStateService.categoriesQParams;
    const sourcesList = SOURCES.filter(item => item.id !== 'banner' && item.id !== 'institucional')
    const sources = this.filtersStateService.convertArrayToQueryParams(sourcesList, 'id');
    const mediums = this.filtersStateService.convertArrayToQueryParams(MEDIUMS, 'id');
    const audiences = this.filtersStateService.convertArrayToQueryParams(AUDIENCES, 'id');

    return `start_date=${startDate}&end_date=${endDate}&sectors=${sectors}&categories=${categories}&sources=${sources}&mediums=${mediums}&audiences=${audiences}${campaignID ? `&campaigns=${campaignID}` : ''}`;
  }

  getCampaigns(retailerID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    const queryParams = this.concatedQueryParams();

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/campaigns?${queryParams}`);
  }

  getCampKpis(retailerID: number, campaignID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    if (!campaignID) {
      return throwError('[campaign-comparator.service]: not campaignID provided');
    }

    const queryParams = this.concatedQueryParams(campaignID);

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/kpis?${queryParams}`);
  }

  getCampAcquisition(retailerID: number, campaignID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    if (!campaignID) {
      return throwError('[campaign-comparator.service]: not campaignID provided');
    }

    const queryParams = this.concatedQueryParams(campaignID);

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/in-retail/campaigns?${queryParams}`);
  }

  getCampConversion(retailerID: number, campaignID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    if (!campaignID) {
      return throwError('[campaign-comparator.service]: not campaignID provided');
    }

    const queryParams = this.concatedQueryParams(campaignID);

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/in-retail/conversions/products?${queryParams}`);
  }
}
