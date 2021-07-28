import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CampaignComparatorService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: Configuration,
  ) {
    this.baseUrl = this.config.endpoint;
  }

  getCampaigns(retailerID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/campaigns`);
  }

  getCampKpis(retailerID: number, campaignID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    if (!campaignID) {
      return throwError('[campaign-comparator.service]: not campaignID provided');
    }

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/campaign-comparison/${campaignID}/kpis`);
  }

  getCampAcquisition(retailerID: number, campaignID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    if (!campaignID) {
      return throwError('[campaign-comparator.service]: not campaignID provided');
    }

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/campaign-comparison/${campaignID}/acquisition`);
  }

  getCampConversion(retailerID: number, campaignID: number) {
    if (!retailerID) {
      return throwError('[campaign-comparator.service]: not retailerID provided');
    }

    if (!campaignID) {
      return throwError('[campaign-comparator.service]: not campaignID provided');
    }

    return this.http.get(`${this.baseUrl}/retailers/${retailerID}/campaign-comparison/${campaignID}/conversion`);
  }
}
