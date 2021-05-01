import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: Configuration
  ) {
    this.baseUrl = this.config.endpoint;
  }

  // *** kpis ***
  getKpis(countryID: number) {
    if (!countryID) {
      return throwError('[overview.service]: not countryID provided');
    }
    return this.http.get(`${this.baseUrl}/country/${countryID}/kpis`);
  }

  // *** categories by sector ***
  getCategoriesBySector(countryID: number, sector: string) {
    if (!countryID) {
      return throwError('[overview.service]: not countryID provided');
    }
    if (!sector) {
      return throwError('[overview.service]: not sector provided');
    }
    return this.http.get(`${this.baseUrl}/country/${countryID}/retailer/categories/sector`);
    return this.http.get(`${this.baseUrl}/country/${countryID}/retailer/categories?sector=${sector}`);
  }

  // *** traffic and sales ***
  getTrafficAndSales(countryID: number, metricType: string, subMetricType: string) {
    if (!countryID) {
      return throwError('[overview.service]: not countryID provided');
    }
    if (!metricType) {
      return throwError('[overview.service]: not metricType provided');
    }
    if (!subMetricType) {
      return throwError('[overview.service]: not subMetricType provided');
    }
    return this.http.get(`${this.baseUrl}/country${countryID}/${metricType}/${subMetricType}`);
  }
}
