import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // sidebar
  private sidebarSource = new Subject<any>();
  sidebarData$ = this.sidebarSource.asObservable();

  // selected main region as LATAM
  private mainRegionSource = new Subject<any>();
  selectedMainRegion$ = this.mainRegionSource.asObservable();
  selectedMainRegion;

  // selected country
  private countrySource = new Subject<any>();
  selectedCountry$ = this.countrySource.asObservable();
  selectedCountry;

  // selected retailer
  private retailerSource = new Subject<any>();
  selectedRetailer$ = this.retailerSource.asObservable();
  selectedRetailer;

  constructor() { }

  selectMainRegion(mainRegion?) {
    if (mainRegion) {
      this.mainRegionSource.next(mainRegion);
      this.selectedMainRegion = mainRegion;
    } else {
      this.mainRegionSource.next();
      this.selectedMainRegion && delete this.selectedMainRegion;
    }
  }

  selectCountry(country?) {
    if (country) {
      this.countrySource.next(country);
      this.selectedCountry = country;
    } else {
      this.countrySource.next();
      this.selectedCountry && delete this.selectedCountry;
    }
  }

  selectRetailer(retailer?) {
    if (retailer) {
      this.retailerSource.next(retailer);
      this.selectedRetailer = retailer;
    } else {
      this.retailerSource.next();
      this.selectedRetailer && delete this.selectedRetailer;
    }
  }

  updateSidebarData(data) {
    this.sidebarSource.next(data);
  }
}
