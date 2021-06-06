import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from './filters-state.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleBusinessService {

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

  getProvinces() {
    let queryParams = this.concatedQueryParams();
    return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/google-my-business/provinces?${queryParams}`);
  }

  getCities() {
    let queryParams = this.concatedQueryParams();
    return this.http.get(`${this.baseUrl}/retailers/${this.retailerID}/google-my-business/cities?${queryParams}`);
  }

  getVisits(provinces: string[], cities: string[]) {
    if (provinces?.length < 1 && cities?.length < 1) {
      return throwError('[google-business.service]: not provinces and cities provided');
    }

    let queryParams = this.concatedQueryParams();
    return this.http.post(`${this.baseUrl}/retailers/${this.retailerID}/google-my-business/visits?${queryParams}`, { provinces, cities });
  }

  getLocations(provinces: string[], cities: string[]) {
    if (provinces?.length < 1 && cities?.length < 1) {
      return throwError('[google-business.service]: not provinces and cities provided');
    }

    let queryParams = this.concatedQueryParams();
    return this.http.post(`${this.baseUrl}/retailers/${this.retailerID}/google-my-business/locations?${queryParams}`, { provinces, cities });
  }
}
