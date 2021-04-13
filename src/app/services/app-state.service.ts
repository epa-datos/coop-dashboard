import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // sidebar
  private sidebarSource = new Subject<any>();
  sidebarData$ = this.sidebarSource.asObservable();

  // selected country
  private countrySource = new Subject<any>();
  selectedCountry$ = this.countrySource.asObservable();

  // selected retailer
  private retailerSource = new Subject<any>();
  selectedRetailer$ = this.retailerSource.asObservable();

  constructor() { }

  selectCountry(country?) {
    if (country) {
      this.countrySource.next(country);
    } else {
      this.countrySource.next();
    }
  }

  selectRetailer(retailer?) {
    if (retailer) {
      this.retailerSource.next(retailer);
    } else {
      this.retailerSource.next();
    }

  }

  updateSidebarData(data) {
    this.sidebarSource.next(data);
  }
}
