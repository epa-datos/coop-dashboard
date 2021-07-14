import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MainRegion, Country, Retailer } from '../models/access-levels';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // sidebar
  private sidebarSource = new Subject<any>();
  sidebarData$ = this.sidebarSource.asObservable();

  // selected main region as LATAM
  private mainRegionSource = new Subject<MainRegion>();
  selectedMainRegion$ = this.mainRegionSource.asObservable();
  selectedMainRegion: MainRegion;

  // selected country
  private countrySource = new Subject<Country>();
  selectedCountry$ = this.countrySource.asObservable();
  selectedCountry: Country;

  // selected retailer
  private retailerSource = new Subject<Retailer>();
  selectedRetailer$ = this.retailerSource.asObservable();
  selectedRetailer: Retailer;

  // selected language
  private langSource = new Subject<string>();
  selectedLang$ = this.langSource.asObservable();
  selectedLang: string;

  constructor() { }

  selectMainRegion(mainRegion?: MainRegion) {
    if (mainRegion) {
      this.mainRegionSource.next(mainRegion);
      this.selectedMainRegion = mainRegion;
    } else {
      this.mainRegionSource.next();
      this.selectedMainRegion && delete this.selectedMainRegion;
    }
  }

  selectCountry(country?: Country) {
    if (country) {
      this.countrySource.next(country);
      this.selectedCountry = country;
    } else {
      this.countrySource.next();
      this.selectedCountry && delete this.selectedCountry;
    }
  }

  selectRetailer(retailer?: Retailer) {
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

  selectLang(lang) {
    this.langSource.next(lang);
    this.selectedLang = lang;
  }
}
