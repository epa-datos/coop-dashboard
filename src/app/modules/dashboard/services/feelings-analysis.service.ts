import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { FiltersStateService } from './filters-state.service';

@Injectable({
  providedIn: 'root'
})
export class FeelingsAnalysisService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: Configuration,
    private filtersStateService: FiltersStateService
  ) {
    this.baseUrl = this.config.endpoint;
  }

  concatedQueryParams(uniqueCategoryID?: number): string {
    let retailers = this.filtersStateService.retailersQParams;
    let startDate = this.filtersStateService.periodQParams.startDate;
    let endDate = this.filtersStateService.periodQParams.endDate;
    let categories = !uniqueCategoryID ? this.filtersStateService.categoriesQParams : uniqueCategoryID;

    return `retailers=${retailers}&start_date=${startDate}&end_date=${endDate}&categories=${categories}`;
  }

  /**
*  GENERIC ENDPOINT
* For endponts with a metric and optional submetric
* @param metricType 
* @param [subMetricType] 
* @returns  
*/
  getDataByMetric(metricType: string, subMetricType?: string, uniqueCategoryID?: number) {
    let queryParams = this.concatedQueryParams(uniqueCategoryID);

    if (!metricType) {
      return throwError('[feelings-analysis]: not metricType provided');
    }
    return this.http.get(`feelings-analysis/latam/${metricType}${subMetricType ? `/${subMetricType}` : ''}?${queryParams}`);
  }

}
