import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {

  countryID: number;
  retailerID: number;

  countrySub: Subscription;
  retailerSub: Subscription;
  filtersSub: Subscription;

  private requestInfoSource = new Subject<boolean>();
  requestInfoChange$ = this.requestInfoSource.asObservable();

  constructor(
    private appStateService: AppStateService,
    private filtersStateService: FiltersStateService,
  ) { }

  ngOnInit(): void {
    const selectedCountry = this.appStateService.selectedCountry;
    const selectedRetailer = this.appStateService.selectedCountry;

    this.countryID = selectedCountry?.id && selectedCountry?.id;
    this.retailerID = selectedRetailer?.id && selectedRetailer?.id;

    // restore init filters
    if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
      this.filtersStateService.restoreFilters();
    }

    // catch selected country
    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      if (country?.id !== this.countryID) {
        this.countryID = country?.id;

        if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {

          if (!this.retailerID) {
            this.filtersStateService.restoreFilters();
            this.requestInfoSource.next();
          }
        }
      }
    });

    // catch if there's a selected retailer
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      if (retailer?.id !== this.retailerID) {
        this.retailerID = retailer?.id;
      }
    });

    // catch a change in general filters
    this.filtersSub = this.filtersStateService.filtersChange$.subscribe((manualChange: boolean) => {
      this.requestInfoSource.next(manualChange);
    });
  }

  ngOnDestroy() {
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
