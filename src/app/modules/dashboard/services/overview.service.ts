import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  private baseUrl: string;
  period = `start_date=2021-04-15&end_date=2021-04-30`

  constructor(
    private http: HttpClient,
    private config: Configuration
  ) {
    this.baseUrl = this.config.endpoint;
  }

  // *** filters ***
  getCampaigns(countryID, sectorsStrList?: string, categoriesStrList?: string) {
    if (!countryID) {
      return throwError('[overview.service]: not countryID provided');
    }

    return this.http.get(`${this.baseUrl}/countries/${countryID}/campaigns?sectors=${sectorsStrList}&categories=${categoriesStrList}&${this.period}`);
  }

  // *** kpis ***
  getKpis(countryID: number) {
    if (!countryID) {
      return throwError('[overview.service]: not countryID provided');
    }
    return this.http.get(`${this.baseUrl}/countries/${countryID}/kpis?sectors=1,2,3&categories=1,2,3,4&${this.period}`);
  }

  // *** categories by sector ***
  getCategoriesBySector(countryID: number, sector: string) {
    if (!countryID) {
      return throwError('[overview.service]: not countryID provided');
    }
    if (!sector) {
      return throwError('[overview.service]: not sector provided');
    }
    // return this.http.get(`${this.baseUrl}/countries/${countryID}/retailer/categories/sector`);
    return this.http.get(`${this.baseUrl}/countries/${countryID}/retailer/categories?sector=${sector}&${this.period}`);
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
    return this.http.get(`${this.baseUrl}/countries/${countryID}/${metricType}/${subMetricType}?${this.period}`);
  }
}
